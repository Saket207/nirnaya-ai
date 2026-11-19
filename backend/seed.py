import uuid
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database.db import SessionLocal, engine, Base
from backend.database.models import Employee
from backend.models.risk_model import get_risk_prediction

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing employees for clean seed
    db.query(Employee).delete()
    db.commit()

    demo_employees = [
        # ── 1. Engineering Department ─────────────────────────────────────────
        {
            "id": "emp-eng-001",
            "name": "Aarav Sharma",
            "role": "Senior Software Engineer",
            "department": "Engineering",
            "tenure_months": 28,
            "engagement_score": 1.5,
            "time_since_promotion_months": 26,
            "overtime_hours": 18.0,
            "JobLevel": 2,
            "WorkLifeBalance": 1,
            "skills": ["Python", "FastAPI", "React", "PostgreSQL", "System Design"],
            "recommendedAction": "Offer expedited promotion evaluation to Tech Lead and enforce 40-hour weekly cap under POL-HR-COC-2026-V4."
        },
        {
            "id": "emp-eng-002",
            "name": "Priya Patel",
            "role": "Full Stack Developer",
            "department": "Engineering",
            "tenure_months": 14,
            "engagement_score": 2.0,
            "time_since_promotion_months": 14,
            "overtime_hours": 12.0,
            "JobLevel": 1,
            "WorkLifeBalance": 2,
            "skills": ["TypeScript", "Node.js", "Docker", "GraphQL"],
            "recommendedAction": "Assign senior technical mentor and rebalance weekly sprint story points."
        },
        {
            "id": "emp-eng-003",
            "name": "Rohan Gupta",
            "role": "Lead DevOps Engineer",
            "department": "Engineering",
            "tenure_months": 42,
            "engagement_score": 3.8,
            "time_since_promotion_months": 6,
            "overtime_hours": 4.0,
            "JobLevel": 3,
            "WorkLifeBalance": 3,
            "skills": ["Kubernetes", "AWS", "Terraform", "CI/CD"],
            "recommendedAction": "Maintain current technical leadership roadmap and involve in multi-region infrastructure expansion."
        },
        {
            "id": "emp-eng-004",
            "name": "Ananya Verma",
            "role": "Backend Engineer",
            "department": "Engineering",
            "tenure_months": 8,
            "engagement_score": 1.0,
            "time_since_promotion_months": 8,
            "overtime_hours": 20.0,
            "JobLevel": 1,
            "WorkLifeBalance": 1,
            "skills": ["Python", "Django", "Redis", "Microservices"],
            "recommendedAction": "Conduct immediate 1-on-1 check-in, redistribute sprint bug debt, and enforce right to disconnect (POL-OPS-002)."
        },
        {
            "id": "emp-eng-005",
            "name": "Ishaan Saxena",
            "role": "Site Reliability Engineer",
            "department": "Engineering",
            "tenure_months": 5,
            "engagement_score": 1.1,
            "time_since_promotion_months": 5,
            "overtime_hours": 22.0,
            "JobLevel": 1,
            "WorkLifeBalance": 1,
            "skills": ["Linux", "Prometheus", "Grafana", "Go", "Incident Response"],
            "recommendedAction": "Reconfigure on-call rotation schedule and assign secondary escalation backup."
        },

        # ── 2. Sales Department ───────────────────────────────────────────────
        {
            "id": "emp-sales-001",
            "name": "Vikram Singh",
            "role": "Enterprise Account Executive",
            "department": "Sales",
            "tenure_months": 36,
            "engagement_score": 1.2,
            "time_since_promotion_months": 30,
            "overtime_hours": 25.0,
            "JobLevel": 2,
            "WorkLifeBalance": 1,
            "skills": ["B2B Sales", "Negotiation", "CRM", "Pipeline Management"],
            "recommendedAction": "Re-evaluate commission tiers and initiate leveling calibration under POL-HR-COC-2026-V4."
        },
        {
            "id": "emp-sales-002",
            "name": "Neha Kapoor",
            "role": "Sales Development Representative",
            "department": "Sales",
            "tenure_months": 6,
            "engagement_score": 3.5,
            "time_since_promotion_months": 6,
            "overtime_hours": 5.0,
            "JobLevel": 1,
            "WorkLifeBalance": 3,
            "skills": ["Cold Outreach", "Lead Generation", "Salesforce"],
            "recommendedAction": "Provide SDR-to-AE promotion milestone track and fast-track training."
        },
        {
            "id": "emp-sales-003",
            "name": "Karan Malhotra",
            "role": "Regional Sales Director",
            "department": "Sales",
            "tenure_months": 48,
            "engagement_score": 3.9,
            "time_since_promotion_months": 12,
            "overtime_hours": 8.0,
            "JobLevel": 4,
            "WorkLifeBalance": 3,
            "skills": ["Strategic Sales", "Team Leadership", "Key Account Management"],
            "recommendedAction": "Support enterprise expansion initiatives into international corporate sectors."
        },
        {
            "id": "emp-sales-004",
            "name": "Sneha Reddy",
            "role": "Account Manager",
            "department": "Sales",
            "tenure_months": 22,
            "engagement_score": 2.2,
            "time_since_promotion_months": 22,
            "overtime_hours": 15.0,
            "JobLevel": 2,
            "WorkLifeBalance": 2,
            "skills": ["Client Upselling", "Renewals", "Customer Retention"],
            "recommendedAction": "Schedule mid-year compensation review and explore 15% Project-Swap exploratory rotation."
        },

        # ── 3. Product Department ─────────────────────────────────────────────
        {
            "id": "emp-prod-001",
            "name": "Siddharth Rao",
            "role": "Senior Product Manager",
            "department": "Product",
            "tenure_months": 30,
            "engagement_score": 1.8,
            "time_since_promotion_months": 28,
            "overtime_hours": 16.0,
            "JobLevel": 3,
            "WorkLifeBalance": 2,
            "skills": ["Product Strategy", "User Research", "Agile", "Roadmapping"],
            "recommendedAction": "Define Principal Product Manager advancement milestones and delegate execution scope."
        },
        {
            "id": "emp-prod-002",
            "name": "Aditya Nair",
            "role": "Product Analyst",
            "department": "Product",
            "tenure_months": 10,
            "engagement_score": 2.1,
            "time_since_promotion_months": 10,
            "overtime_hours": 14.0,
            "JobLevel": 1,
            "WorkLifeBalance": 2,
            "skills": ["Mixpanel", "SQL", "Data Analytics", "A/B Testing"],
            "recommendedAction": "Enroll in advanced product strategy learning program using $1,200 L&D budget (POL-FIN-EXP-2026-V1)."
        },
        {
            "id": "emp-prod-003",
            "name": "Shreya Bannerjee",
            "role": "Group Product Manager",
            "department": "Product",
            "tenure_months": 38,
            "engagement_score": 3.7,
            "time_since_promotion_months": 8,
            "overtime_hours": 5.0,
            "JobLevel": 3,
            "WorkLifeBalance": 3,
            "skills": ["Product Vision", "Team Leadership", "Cross-Functional Ops", "P&L"],
            "recommendedAction": "Facilitate executive strategy workshops for next fiscal year product goals."
        },

        # ── 4. Data & AI Department ───────────────────────────────────────────
        {
            "id": "emp-data-001",
            "name": "Arjun Sundaram",
            "role": "Lead Data Scientist",
            "department": "Data & AI",
            "tenure_months": 32,
            "engagement_score": 1.6,
            "time_since_promotion_months": 26,
            "overtime_hours": 19.0,
            "JobLevel": 3,
            "WorkLifeBalance": 1,
            "skills": ["PyTorch", "LLMs", "Vector DBs", "MLOps", "Transformers"],
            "recommendedAction": "Initiate leveling calibration under POL-HR-COC-2026-V4 and assign secondary research fellow."
        },
        {
            "id": "emp-data-002",
            "name": "Kavya Menon",
            "role": "Machine Learning Engineer",
            "department": "Data & AI",
            "tenure_months": 16,
            "engagement_score": 2.4,
            "time_since_promotion_months": 16,
            "overtime_hours": 13.0,
            "JobLevel": 2,
            "WorkLifeBalance": 2,
            "skills": ["Python", "TensorFlow", "Kubeflow", "Feature Store", "Docker"],
            "recommendedAction": "Provide access to GPU infrastructure scaling and cloud MLOps budget."
        },
        {
            "id": "emp-data-003",
            "name": "Devansh Bhatia",
            "role": "Data Engineer",
            "department": "Data & AI",
            "tenure_months": 24,
            "engagement_score": 3.6,
            "time_since_promotion_months": 6,
            "overtime_hours": 3.0,
            "JobLevel": 2,
            "WorkLifeBalance": 4,
            "skills": ["Apache Spark", "Airflow", "Snowflake", "dbt", "PostgreSQL"],
            "recommendedAction": "Empower data architecture pipeline modernization initiatives."
        },

        # ── 5. Customer Success & Support ─────────────────────────────────────
        {
            "id": "emp-cs-001",
            "name": "Manish Tiwari",
            "role": "Director of Customer Success",
            "department": "Customer Success",
            "tenure_months": 44,
            "engagement_score": 3.8,
            "time_since_promotion_months": 10,
            "overtime_hours": 6.0,
            "JobLevel": 4,
            "WorkLifeBalance": 3,
            "skills": ["Executive Relationship Management", "NPS Growth", "Churn Prevention", "Support Ops"],
            "recommendedAction": "Expand global client onboarding strategy and tier 1 escalation frameworks."
        },
        {
            "id": "emp-cs-002",
            "name": "Pooja Hegde",
            "role": "Technical Account Manager",
            "department": "Customer Success",
            "tenure_months": 26,
            "engagement_score": 1.4,
            "time_since_promotion_months": 24,
            "overtime_hours": 21.0,
            "JobLevel": 2,
            "WorkLifeBalance": 1,
            "skills": ["Client Escalations", "Enterprise SLA", "Zendesk", "Customer Advocacy"],
            "recommendedAction": "Rebalance enterprise tier workload and trigger stagnation leveling calibration."
        },
        {
            "id": "emp-cs-003",
            "name": "Akash Chawla",
            "role": "Tier 2 Support Specialist",
            "department": "Customer Success",
            "tenure_months": 11,
            "engagement_score": 3.4,
            "time_since_promotion_months": 11,
            "overtime_hours": 4.0,
            "JobLevel": 1,
            "WorkLifeBalance": 3,
            "skills": ["Troubleshooting", "API Debugging", "Log Analysis", "Jira Service Desk"],
            "recommendedAction": "Enroll in TAM career progression mentorship program."
        },

        # ── 6. Finance & Operations ───────────────────────────────────────────
        {
            "id": "emp-fin-001",
            "name": "Rajesh Nambiar",
            "role": "Head of Financial Planning (FP&A)",
            "department": "Finance & Operations",
            "tenure_months": 36,
            "engagement_score": 3.7,
            "time_since_promotion_months": 12,
            "overtime_hours": 6.0,
            "JobLevel": 3,
            "WorkLifeBalance": 3,
            "skills": ["Corporate Finance", "Fiscal Forecasting", "Budget Allocation", "Compliance"],
            "recommendedAction": "Oversee enterprise financial automation and audit governance."
        },
        {
            "id": "emp-fin-002",
            "name": "Tanvi Joshi",
            "role": "Operations & Procurement Specialist",
            "department": "Finance & Operations",
            "tenure_months": 18,
            "engagement_score": 1.7,
            "time_since_promotion_months": 18,
            "overtime_hours": 16.0,
            "JobLevel": 1,
            "WorkLifeBalance": 2,
            "skills": ["Vendor Management", "Contract Governance", "SAP ERP", "Cost Optimization"],
            "recommendedAction": "Automate routine invoice approvals and approve remote flexibility."
        },

        # ── 7. Cybersecurity & IT Infrastructure ──────────────────────────────
        {
            "id": "emp-sec-001",
            "name": "Karthik Venkatesh",
            "role": "Principal Security Architect",
            "department": "Cybersecurity & IT",
            "tenure_months": 40,
            "engagement_score": 3.9,
            "time_since_promotion_months": 8,
            "overtime_hours": 5.0,
            "JobLevel": 4,
            "WorkLifeBalance": 3,
            "skills": ["Zero Trust", "Cloud Security", "SOC2 Compliance", "Threat Modeling"],
            "recommendedAction": "Lead upcoming SOC2 Type II certification and executive vulnerability assessments."
        },
        {
            "id": "emp-sec-002",
            "name": "Simran Kaur",
            "role": "SOC Analyst & Incident Responder",
            "department": "Cybersecurity & IT",
            "tenure_months": 14,
            "engagement_score": 1.3,
            "time_since_promotion_months": 14,
            "overtime_hours": 23.0,
            "JobLevel": 1,
            "WorkLifeBalance": 1,
            "skills": ["SIEM", "Splunk", "Penetration Testing", "Network Forensics"],
            "recommendedAction": "Institute relief shift scheduling to reduce high alert-fatigue burnout."
        },

        # ── 8. Design & User Experience ───────────────────────────────────────
        {
            "id": "emp-des-001",
            "name": "Meera Joshi",
            "role": "Lead Design Systems Architect",
            "department": "Design & UX",
            "tenure_months": 30,
            "engagement_score": 3.8,
            "time_since_promotion_months": 6,
            "overtime_hours": 3.0,
            "JobLevel": 3,
            "WorkLifeBalance": 4,
            "skills": ["Figma", "Design Tokens", "Accessibility (a11y)", "Design Systems"],
            "recommendedAction": "Encourage design workshop facilitation and cross-company token adoption."
        },
        {
            "id": "emp-des-002",
            "name": "Varun Tandon",
            "role": "Senior UI/UX Researcher",
            "department": "Design & UX",
            "tenure_months": 25,
            "engagement_score": 1.9,
            "time_since_promotion_months": 25,
            "overtime_hours": 15.0,
            "JobLevel": 2,
            "WorkLifeBalance": 2,
            "skills": ["Usability Testing", "Wireframing", "User Personas", "Prototyping"],
            "recommendedAction": "Conduct leveling review for Principal Track and authorize 15% Project-Swap rotation."
        },

        # ── 9. Human Resources ────────────────────────────────────────────────
        {
            "id": "emp-hr-001",
            "name": "Kavita Deshmukh",
            "role": "HR Business Partner",
            "department": "Human Resources",
            "tenure_months": 32,
            "engagement_score": 3.6,
            "time_since_promotion_months": 10,
            "overtime_hours": 6.0,
            "JobLevel": 3,
            "WorkLifeBalance": 3,
            "skills": ["Employee Relations", "Talent Management", "Conflict Resolution"],
            "recommendedAction": "Lead upcoming company-wide retention strategy and onboarding revamp."
        },
        {
            "id": "emp-hr-002",
            "name": "Tarun Kumar",
            "role": "Talent Acquisition Specialist",
            "department": "Human Resources",
            "tenure_months": 15,
            "engagement_score": 1.4,
            "time_since_promotion_months": 15,
            "overtime_hours": 19.0,
            "JobLevel": 1,
            "WorkLifeBalance": 1,
            "skills": ["Tech Recruiting", "LinkedIn Recruiter", "Sourcing"],
            "recommendedAction": "Outsource high-volume screening tasks to relieve hiring burden."
        },

        # ── 10. Marketing Department ──────────────────────────────────────────
        {
            "id": "emp-mkt-001",
            "name": "Diya Sen",
            "role": "Growth Marketing Lead",
            "department": "Marketing",
            "tenure_months": 24,
            "engagement_score": 2.0,
            "time_since_promotion_months": 24,
            "overtime_hours": 14.0,
            "JobLevel": 2,
            "WorkLifeBalance": 2,
            "skills": ["SEO", "Performance Marketing", "Google Ads", "Content Strategy"],
            "recommendedAction": "Review growth leadership progression and allocate external agency budget."
        },
        {
            "id": "emp-mkt-002",
            "name": "Varun Mehta",
            "role": "Content Strategist",
            "department": "Marketing",
            "tenure_months": 40,
            "engagement_score": 3.9,
            "time_since_promotion_months": 4,
            "overtime_hours": 2.0,
            "JobLevel": 2,
            "WorkLifeBalance": 4,
            "skills": ["Copywriting", "Brand Strategy", "Social Media", "PR"],
            "recommendedAction": "Continue empowering content creation for international marketing campaigns."
        }
    ]

    count = 0
    for emp_data in demo_employees:
        feature_dict = {
            "tenure_months": emp_data["tenure_months"],
            "engagement_score": emp_data["engagement_score"],
            "time_since_promotion_months": emp_data["time_since_promotion_months"],
            "overtime_hours": emp_data["overtime_hours"],
            "JobLevel": emp_data["JobLevel"],
            "WorkLifeBalance": emp_data["WorkLifeBalance"]
        }

        # Predict ML risk score & explainability
        prediction = get_risk_prediction(feature_dict)

        emp = Employee(
            id=emp_data["id"],
            name=emp_data["name"],
            role=emp_data["role"],
            department=emp_data["department"],
            tenure_months=emp_data["tenure_months"],
            engagement_score=emp_data["engagement_score"],
            time_since_promotion_months=emp_data["time_since_promotion_months"],
            overtime_hours=emp_data["overtime_hours"],
            JobLevel=emp_data["JobLevel"],
            WorkLifeBalance=emp_data["WorkLifeBalance"],
            skills=emp_data["skills"],
            riskScore=prediction["riskScore"],
            riskLevel=prediction["riskLevel"],
            summary=prediction["summary"],
            reasons=prediction["reasons"],
            protectiveFactors=prediction["protectiveFactors"],
            recommendedAction=emp_data["recommendedAction"]
        )
        db.add(emp)
        count += 1

    db.commit()
    print(f"Successfully seeded database with {count} realistic demo employees across 10 specialized departments.")
    db.close()

if __name__ == "__main__":
    seed_database()
