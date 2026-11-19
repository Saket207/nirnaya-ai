import os
import re
import json
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

# Check for LLM client availability
try:
    from groq import Groq
    groq_api_key = os.getenv("GROQ_API_KEY") or os.getenv("LLM_API_KEY")
    groq_client = Groq(api_key=groq_api_key) if groq_api_key else None
except Exception:
    groq_client = None

# ── Domain Skills & Department Taxonomies ──────────────────────────────────────
SKILL_TAXONOMY = {
    "Languages & Frameworks": [
        "Python", "FastAPI", "Django", "Flask", "JavaScript", "TypeScript", "React",
        "Next.js", "Node.js", "Express", "Java", "Spring Boot", "Go", "Golang", "Rust",
        "C++", "C#", ".NET", "PHP", "Ruby", "Rails", "HTML5", "CSS3", "Tailwind CSS"
    ],
    "Cloud & DevOps": [
        "AWS", "Google Cloud", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
        "CI/CD", "GitHub Actions", "GitLab CI", "Linux", "Nginx", "Helm", "Prometheus", "Grafana"
    ],
    "Data & AI": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Kafka", "RabbitMQ",
        "PyTorch", "TensorFlow", "Scikit-Learn", "XGBoost", "Pandas", "NumPy", "Airflow",
        "Snowflake", "Databricks", "ChromaDB", "LangChain", "Vector DBs", "SQL"
    ],
    "Design & Product": [
        "Figma", "UI/UX", "User Research", "Prototyping", "Design Systems", "Agile",
        "Scrum", "Jira", "Product Strategy", "A/B Testing", "Mixpanel", "Analytics"
    ],
    "Business & HR": [
        "Talent Acquisition", "Technical Recruiting", "HRBP", "Employee Relations",
        "Compensation & Benefits", "B2B Sales", "Enterprise Sales", "CRM", "Salesforce",
        "Content Marketing", "SEO", "Growth Marketing"
    ],
    "Core Non-Technical": [
        "System Architecture", "Technical Leadership", "Cross-Functional Collaboration",
        "Mentorship", "Problem Solving", "Conflict Resolution", "Stakeholder Management"
    ]
}

DEPARTMENT_MAP = {
    "Engineering": ["developer", "engineer", "devops", "architect", "programmer", "qa", "sre", "frontend", "backend", "full stack", "cloud"],
    "Product": ["product manager", "product owner", "designer", "ui/ux", "ux", "ui", "product analyst"],
    "Sales": ["sales", "account executive", "bdr", "sdr", "account manager", "business development"],
    "Human Resources": ["hr", "human resources", "recruiter", "talent", "hrbp", "people operations", "people ops"],
    "Marketing": ["marketing", "growth", "seo", "content", "copywriter", "brand"]
}

# ── Text Extraction Helpers for Resumes ───────────────────────────────────────
def extract_text_from_file_bytes(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().split(".")[-1]
    text = ""

    if ext == "pdf":
        try:
            import pdfminer.high_level
            import io
            text = pdfminer.high_level.extract_text(io.BytesIO(file_bytes))
        except Exception as e:
            text = f"[PDF Extraction Warning: {e}]"
    elif ext in ["docx", "doc"]:
        try:
            import docx
            import io
            doc = docx.Document(io.BytesIO(file_bytes))
            text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        except Exception as e:
            text = f"[DOCX Extraction Warning: {e}]"
    else:
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            text = str(file_bytes)

    return text.strip()


# ── Intelligent Resume / Profile Parser ───────────────────────────────────────
def parse_resume_or_profile_text(raw_text: str, current_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    profile = current_profile.copy() if current_profile else {
        "name": "",
        "email": "",
        "phone": "",
        "location": "Bengaluru, India",
        "role": "",
        "department": "",
        "work_model": "Hybrid (3 days office, 2 days remote)",
        "JobLevel": 1,
        "skills": [],
        "education": [],
        "experience": [],
        "certifications": [],
        "projects": [],
        "responsibilities": [],
        "career_goals": {
            "short_term": "",
            "long_term": "",
            "learning_preferences": ["Hands-on Architecture Projects", "Cloud Certifications"]
        }
    }

    # Extract Contact Details
    # Email
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_text)
    if email_match and not profile.get("email"):
        profile["email"] = email_match.group(0).strip()

    # Phone
    phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", raw_text)
    if phone_match and not profile.get("phone"):
        profile["phone"] = phone_match.group(0).strip()

    # Name extraction
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]
    if not profile.get("name") and lines:
        for line in lines[:5]:
            clean_line = re.sub(r"^(resume|curriculum vitae|cv|name:?|i am|i'm)\s*", "", line, flags=re.I).strip()
            # If line is 2 to 4 capitalized words and doesn't contain email or digits
            words = clean_line.split()
            if 1 <= len(words) <= 4 and all(w.isalpha() for w in words) and not any(k in clean_line.lower() for k in ["curriculum", "vitae", "resume", "engineer", "developer", "experience", "skills"]):
                profile["name"] = clean_line
                break

    # Role extraction
    lower_text = raw_text.lower()
    if not profile.get("role"):
        common_roles = [
            "Senior Software Engineer", "Software Engineer", "Lead Frontend Engineer", "Frontend Engineer",
            "Senior Backend Engineer", "Backend Engineer", "Full Stack Developer", "Lead DevOps Engineer",
            "DevOps Engineer", "Data Engineer", "Machine Learning Engineer", "UI/UX Designer",
            "Senior Product Manager", "Product Manager", "Product Analyst", "Enterprise Account Executive",
            "Account Executive", "HR Business Partner", "Talent Acquisition Specialist", "Growth Marketing Lead"
        ]
        for role in common_roles:
            if role.lower() in lower_text:
                profile["role"] = role
                break

    # Inferred Department
    if not profile.get("department"):
        target_role = profile.get("role", "").lower()
        dept_assigned = False
        for dept, keywords in DEPARTMENT_MAP.items():
            if any(k in target_role for k in keywords) or any(k in lower_text for k in keywords[:2]):
                profile["department"] = dept
                dept_assigned = True
                break
        if not dept_assigned:
            profile["department"] = "Engineering"

    # Infer JobLevel based on years or seniority keywords
    if any(k in lower_text for k in ["lead", "principal", "director", "staff", "architect"]):
        profile["JobLevel"] = 3
    elif any(k in lower_text for k in ["senior", "sr.", "sr ", "4+ years", "5+ years", "6+ years"]):
        profile["JobLevel"] = 2
    else:
        profile["JobLevel"] = 1

    # Extract Skills with proficiency classification
    existing_skill_names = {s["name"].lower() if isinstance(s, dict) else s.lower() for s in profile.get("skills", [])}
    extracted_skills_list = []

    for category, skills in SKILL_TAXONOMY.items():
        for skill in skills:
            pattern = r"\b" + re.escape(skill.lower()) + r"\b"
            if re.search(pattern, lower_text) and skill.lower() not in existing_skill_names:
                # Estimate proficiency & years based on role level
                years = 3 if profile["JobLevel"] == 3 else (2 if profile["JobLevel"] == 2 else 1)
                level = "Advanced" if profile["JobLevel"] >= 2 else "Intermediate"

                extracted_skills_list.append({
                    "name": skill,
                    "category": category,
                    "proficiency": level,
                    "years": years,
                    "is_primary": True if len(extracted_skills_list) < 5 else False
                })
                existing_skill_names.add(skill.lower())

    if extracted_skills_list:
        profile["skills"].extend(extracted_skills_list)

    # Extract Education
    degree_patterns = [
        r"(Bachelor(?:\'s)?\s+(?:of\s+[A-Za-z\s]+|in\s+[A-Za-z\s]+|Technology|Science|Engineering)|B\.?Tech|B\.?E\.?|B\.?S\.?)",
        r"(Master(?:\'s)?\s+(?:of\s+[A-Za-z\s]+|in\s+[A-Za-z\s]+|Technology|Science|Engineering)|M\.?Tech|M\.?E\.?|M\.?S\.?|MBA)",
        r"(Ph\.?D|Doctorate)"
    ]
    for pattern in degree_patterns:
        match = re.search(pattern, raw_text, re.IGNORECASE)
        if match and not any(e.get("degree") == match.group(0).strip() for e in profile.get("education", [])):
            profile.setdefault("education", []).append({
                "degree": match.group(0).strip(),
                "institution": "Recognized Institute / University",
                "year": "2023"
            })

    # Extract Certifications
    cert_keywords = ["AWS Certified", "GCP Certified", "CKA", "CKAD", "PMP", "Scrum Master", "Terraform Associate", "Azure Solutions"]
    for cert in cert_keywords:
        if cert.lower() in lower_text and not any(c.get("name") == cert for c in profile.get("certifications", [])):
            profile.setdefault("certifications", []).append({
                "name": cert,
                "issuer": "Industry Provider",
                "year": "2024"
            })

    # Extract Notable Projects if mentioned
    project_matches = re.findall(r"(?:Project|Initiative):\s*([^\n\.]+)", raw_text, re.IGNORECASE)
    for p in project_matches[:3]:
        clean_p = p.strip()
        if clean_p and not any(proj.get("title") == clean_p for proj in profile.get("projects", [])):
            profile.setdefault("projects", []).append({
                "title": clean_p,
                "tech_stack": ["Python", "FastAPI", "PostgreSQL"],
                "description": "High-throughput enterprise service developed to automate business operations."
            })

    # Default Project if none found
    if not profile.get("projects"):
        profile["projects"] = [
            {
                "title": "Scalable Cloud Architecture & API Pipeline",
                "tech_stack": [s["name"] for s in profile.get("skills", [])[:3]] or ["Python", "React", "Docker"],
                "description": "Designed resilient distributed service with automated testing and CI/CD integration."
            }
        ]

    # Responsibilities
    if not profile.get("responsibilities"):
        role_name = profile.get("role") or "Software Engineer"
        profile["responsibilities"] = [
            f"Deliver high-quality software architectures adhering to {profile.get('department', 'Engineering')} standards",
            "Participate in sprint planning, code reviews, and technical design RFCs",
            "Collaborate cross-functionally with Product, QA, and DevOps teams"
        ]

    # Career Goals
    if not profile.get("career_goals", {}).get("short_term"):
        profile["career_goals"] = {
            "short_term": f"Master the Nirnaya system architecture and lead first production delivery within 60 days.",
            "long_term": f"Evolve into a Technical Lead / Staff {profile.get('role', 'Engineer')} with deep architectural ownership.",
            "learning_preferences": ["Hands-on Architecture Projects", "Cloud Architecture Certifications", "1-on-1 Mentorship"]
        }

    return profile


# ── Skill Gap Analysis & Personalized Onboarding Roadmap ────────────────────
def generate_skill_analysis_and_roadmap(profile: Dict[str, Any]) -> Dict[str, Any]:
    role = profile.get("role") or "Software Engineer"
    department = profile.get("department") or "Engineering"
    skills = profile.get("skills", [])
    skill_names = [s["name"] if isinstance(s, dict) else str(s) for s in skills]

    # Baseline expectations per role
    strengths = []
    opportunities = []

    if department == "Engineering":
        if any(s in skill_names for s in ["FastAPI", "Python", "TypeScript", "React", "Node.js"]):
            strengths.append("Strong foundational backend and frontend service development stack")
        if any(s in skill_names for s in ["Docker", "Kubernetes", "AWS", "CI/CD"]):
            strengths.append("Solid familiarity with containerized deployments and cloud infrastructure")
        else:
            opportunities.append("Target AWS / Kubernetes cloud certification using company $1,200 L&D budget")
        if not any(s in skill_names for s in ["System Architecture", "Technical Leadership"]):
            opportunities.append("Pair with Senior Technical Lead for quarterly architecture review mentorship")
    else:
        strengths.append("Domain capability aligned with team strategic deliverables")
        opportunities.append("Complete Nirnaya Enterprise operational workflows and stakeholder alignment")

    if not strengths:
        strengths = ["Strong growth mindset and cross-functional technical adaptability"]

    # 30-60-90 Day Roadmap
    roadmap = [
        {
            "phase": "Day 1 - 30: Foundation & Orientation",
            "focus": "Environment Setup & Policy Integration",
            "milestones": [
                "Set up company hardware and claim $600 home office equipment allowance (POL-OPS-002)",
                "Complete zero-tolerance Code of Conduct & Security Compliance modules (POL-HR-COC-2026-V4)",
                "Complete first pull request / ticket deployment with paired peer mentor",
                "Attend first bi-weekly 1:1 check-in with Department Head"
            ]
        },
        {
            "phase": "Day 31 - 60: Autonomous Execution",
            "focus": "Core Project Delivery & Integration",
            "milestones": [
                "Own and ship milestone feature module in active department sprint",
                "Utilize $1,200 annual professional development allowance for technical certification (POL-FIN-EXP-2026-V1)",
                "Conduct cross-functional demo presentation with Product and Design teams"
            ]
        },
        {
            "phase": "Day 61 - 90: Impact & Growth Path",
            "focus": "Leveling Calibration & Strategic Contribution",
            "milestones": [
                "Lead knowledge-sharing tech talk or design RFC document",
                "Formal 90-day onboarding review and KPI calibration review with HRBP",
                "Establish 12-month leveling progression trajectory"
            ]
        }
    ]

    # Policy Entitlements
    policy_benefits = [
        {
            "title": "Home Office Setup Stipend",
            "value": "$600 one-time reimbursement",
            "policy": "POL-OPS-002 (Hybrid & WFH Policy)",
            "details": "Eligible after 90 days for ergonomic chair, monitor, and peripherals."
        },
        {
            "title": "Monthly Connectivity Allowance",
            "value": "$50 / month",
            "policy": "POL-OPS-002 (Hybrid & WFH Policy)",
            "details": "Reimbursed for high-speed home internet and mobile data."
        },
        {
            "title": "Professional L&D Budget",
            "value": "$1,200 / calendar year",
            "policy": "POL-FIN-EXP-2026-V1 (Expense Policy)",
            "details": "Covers cloud certifications (AWS, GCP, CKA), conferences, and paid courses."
        },
        {
            "title": "Paid Annual & Sick Leave",
            "value": "18 Annual Days + 12 Sick Days",
            "policy": "POL-HR-LEAVE-2026-V1 (Leave Policy)",
            "details": "Up to 10 unused days carried forward; sick leaves 1-3 days self-certified."
        }
    ]

    # Identify Missing Details
    missing_items = []
    if not profile.get("email"):
        missing_items.append("Work or personal email address")
    if not profile.get("phone"):
        missing_items.append("Contact telephone number")
    if not profile.get("name"):
        missing_items.append("Candidate legal full name")
    if not profile.get("role"):
        missing_items.append("Designated job role")
    if not profile.get("department"):
        missing_items.append("Assigned department")

    return {
        "strengths": strengths,
        "opportunities": opportunities,
        "roadmap": roadmap,
        "policy_benefits": policy_benefits,
        "missing_items": missing_items,
        "readiness_score": 95 if not missing_items else max(60, 100 - len(missing_items) * 10)
    }


# ── Conversational Chat Agent ───────────────────────────────────────────────
def process_onboarding_conversation(user_message: str, current_profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    # 1. Parse text against profile
    updated_profile = parse_resume_or_profile_text(user_message, current_profile)

    # 2. Analyze profile
    analysis = generate_skill_analysis_and_roadmap(updated_profile)

    # 3. Formulate conversational response
    name = updated_profile.get("name")
    role = updated_profile.get("role")
    dept = updated_profile.get("department")

    missing = analysis["missing_items"]

    if not missing:
        reply = (
            f"Outstanding! I have compiled your complete workforce profile: **{name}**, joining as **{role}** "
            f"in the **{dept}** department.\n\n"
            f"I have also conducted an initial **Skill Gap Analysis** and mapped out your **30-60-90 Day Ramp-Up Roadmap**. "
            f"Please review the detailed profile sections below and confirm registration into our system!"
        )
    else:
        intro = f"Thanks for sharing! "
        if name or role or dept:
            intro += f"I have noted your details ({', '.join(filter(None, [f'Name: {name}' if name else '', f'Role: {role}' if role else '', f'Dept: {dept}' if dept else '']))}). "
        reply = (
            f"{intro}To ensure your onboarding packet is 100% complete, could you also provide: "
            f"**{', '.join(missing)}**?"
        )

    return {
        "reply": reply,
        "profile": updated_profile,
        "analysis": analysis,
        "is_complete": len(missing) == 0,
        "source": "Nirnaya GenAI Workforce Engine"
    }
