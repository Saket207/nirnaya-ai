# Nirnaya.ai — AI-Driven Workforce Intelligence Platform

> **From continuous workforce telemetry to mathematically explainable, policy-verified HR decisions.**

**Team:** Curious Coders  
**Institution:** Dayananda Sagar College of Engineering (DSCE), Bengaluru  
**Theme:** AI in HR & Workforce Management (DSCE Hackathon 2026)  
**Status:** ✅ Production Ready v1.0 (Full Stack Integrated)

---

## 📌 Executive Summary

**Nirnaya.ai** is an enterprise workforce intelligence platform that bridges the gap between passive HR telemetry and proactive leadership decision-making. 

Traditional HR systems operate in silos — attendance logs, performance reviews, compensation benchmarks, and employee handbooks live in separate databases. Consequently, HR leaders discover attrition risks only during exit interviews when it is already too late.

Nirnaya.ai unifies these disparate signals into an **explainable, policy-governed command center**:
1. **Predictive Risk Telemetry**: Calibrated XGBoost attrition classification trained on enterprise workforce features (~84.2% accuracy).
2. **Game-Theoretic Explainability**: Instant TreeSHAP feature attributions isolating exact risk drivers (e.g., overtime burnout, promotion lag) from protective factors (e.g., competitive compa-ratio, job leveling).
3. **Policy-Governed Interventions**: ChromaDB vector retrieval coupled with Groq high-speed LLM inference to audit all mitigation actions against verified corporate handbooks with exact section citations.
4. **Autonomous AI Onboarding Studio**: Conversational profile synthesis, resume parsing, dynamic skills taxonomy extraction, and tailored 30-60-90 day milestone roadmaps.
5. **Noovotic-Inspired Editorial Experience**: High-contrast, typography-driven UI built with an organic palette (`#FBF4EF` parchment, `#312C29` deep espresso, `#D9684C` terracotta accent).

---

## 💡 System Architecture

```text
                                 ┌─────────────────────────┐
                                 │   HR / People Leader    │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │  React 18 + Tailwind    │
                                 │  Editorial UI (Port 3000)│
                                 └────────────┬────────────┘
                                              │ REST APIs
                                              ▼
                                 ┌─────────────────────────┐
                                 │     FastAPI Backend     │
                                 │      (Port 8000)        │
                                 └────────────┬────────────┘
                                              │
            ┌─────────────────────────────────┼─────────────────────────────────┐
            │                                 │                                 │
            ▼                                 ▼                                 ▼
   ┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
   │   Risk Engine   │               │  GenAI Engine   │               │ Database Layer  │
   │ XGBoost + SHAP  │               │   Groq Llama-3  │               │ PostgreSQL /    │
   │  Classification │               │  Vector RAG     │               │ SQLite Fallback │
   └────────┬────────┘               └────────┬────────┘               └─────────────────┘
            │                                 │
            │                         ┌───────┴────────┐
            ▼                         ▼                ▼
   ┌─────────────────┐       ┌─────────────────┐ ┌──────────────┐
   │ Mathematical    │       │    ChromaDB     │ │  4 Corporate │
   │ Explainability  │       │  Vector Embed   │ │  Handbooks   │
   └────────┬────────┘       └────────┬────────┘ └──────────────┘
            │                         │
            └───────────┬─────────────┘
                        │
                        ▼
         ┌─────────────────────────────┐
         │ Policy-Verified Mitigation  │
         │ Actions & Retention Plans   │
         └─────────────────────────────┘
```

---

## ⭐ Complete Feature Matrix

| Engine / Module | Status | Core Capabilities & Technologies |
| :--- | :---: | :--- |
| **Editorial Homepage** | ✅ Completed | Noovotic-inspired design language, interactive scroll parallax, responsive 4-step workflow grid, Michelangelo creation hands animation, real-world case studies, and 1-click persona quick launch. |
| **Executive Risk Dashboard** | ✅ Completed | Department filtering, risk tier distribution (High, Medium, Low), overtime burnout metrics, real-time search, quick employee dossiers, and department health indicators. |
| **Employee Dossier & SHAP Engine** | ✅ Completed | Mathematical TreeSHAP force breakdown, feature impact weights, burnout radar chart, tenure telemetry, and 1-click AI mitigation plan generation. |
| **Department Rollups (10 Teams)** | ✅ Completed | Aggregate risk metrics across 10 business units (Engineering, Data & AI, Sales, Operations, Product, HR, Marketing, Finance, Legal, CS), cross-department burnout comparisons. |
| **Policy Q&A Intelligence** | ✅ Completed | ChromaDB vector search + Groq Llama-3 indexing 4 corporate handbooks with verified section citations, latency metrics (<95ms), and 6 one-click query templates. |
| **AI Onboarding Studio** | ✅ Completed | Conversational multi-turn onboarding chat, automated resume & profile extraction, dynamic skills badge generation, and customizable 30-60-90 day milestone roadmaps. |
| **Enterprise Directory CRUD** | ✅ Completed | Full employee management portal: search, multi-field filters, status badges, modal creation and edit forms, and real-time database synchronisation. |
| **Persona-Based RBAC** | ✅ Completed | Instant role switchboard: **Aditi Sharma** (HR Director), **Rajiv Nair** (Engineering Lead), and **Priya Sharma** (Employee). |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom editorial tokens (`font-heading`, `#FBF4EF` parchment, `#312C29` charcoal, `#D9684C` terracotta)
- **Data Visualization:** Recharts (ResponsiveContainer, BarChart, RadarChart, PieChart, Cell, Tooltip)
- **Icons:** Lucide React (feather-light SVG iconography)
- **Routing:** React Router v6 with active breadcrumbs and error boundary protection

### Backend & Machine Learning
- **API Framework:** FastAPI (Python 3.11 / 3.13) with asynchronous request handlers
- **Risk Classification:** XGBoost Classifier trained on multi-dimensional workforce telemetry (`ml/train_model.py`)
- **Model Explainability:** TreeSHAP (`shap.TreeExplainer`) isolating positive and negative feature contributions
- **Database & ORM:** SQLAlchemy with PostgreSQL support and automated SQLite zero-configuration fallback
- **Validation:** Pydantic v2 schemas (`backend/schemas.py`)

### Generative AI & Vector Policy RAG
- **LLM Inference:** Groq Cloud API (`openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `llama3-70b-8192`)
- **Vector Database:** ChromaDB vector embeddings indexing corporate policy documents
- **Ingested Policy Handbooks:**
  1. *Code of Conduct & Ethics* (`POL-HR-COC-2026-V4`)
  2. *Leave & Attendance Guidelines* (`POL-HR-LVE-2026-V2`)
  3. *Remote & Flexible Work Policy* (`POL-HR-WFH-2026-V3`)
  4. *Travel & Expense Reimbursement Policy* (`POL-FIN-EXP-2026-V1`)

---

## 📁 Repository Structure

```text
nirnaya-ai/
├── frontend/                     # React 18 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/           # Navbar, Layout, ErrorBoundary, LoadingSkeleton
│   │   ├── context/              # AuthContext (RBAC), ToastContext
│   │   ├── pages/
│   │   │   ├── HomePage.jsx               # Editorial Noovotic landing page
│   │   │   ├── DashboardPage.jsx          # HR Executive risk command center
│   │   │   ├── EmployeeDetailPage.jsx     # Dossier with SHAP explainability
│   │   │   ├── TeamViewPage.jsx           # 10 Department rollups & health
│   │   │   ├── OnboardingPage.jsx         # Conversational AI onboarding studio
│   │   │   ├── PolicyQAPage.jsx           # Vector RAG policy intelligence
│   │   │   ├── EmployeeManagementPage.jsx # Enterprise CRUD directory
│   │   │   ├── LoginPage.jsx              # Persona switchboard
│   │   │   └── NotFoundPage.jsx           # 404 brand view
│   │   ├── services/             # Axios API client & mock fallback services
│   │   ├── App.jsx               # Route declarations & navigation tree
│   │   ├── main.jsx              # App entrypoint
│   │   └── index.css             # Tailwind base layers & typography
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI Python Application
│   ├── main.py                   # FastAPI server entrypoint & CORS setup
│   ├── schemas.py                # Pydantic request/response schemas
│   ├── seed.py                   # 16-profile demo data seeding script
│   ├── database/
│   │   ├── db.py                 # SQLAlchemy engine & session maker
│   │   └── models.py             # Employee ORM database models
│   ├── routes/
│   │   ├── employee_routes.py    # CRUD endpoints for workforce profiles
│   │   ├── risk_routes.py        # XGBoost & SHAP prediction endpoints
│   │   ├── team_routes.py        # Department aggregation endpoints
│   │   └── genai_routes.py       # Onboarding, Policy Q&A, and Mitigation
│   ├── models/
│   │   ├── risk_model.py         # XGBoost model loader & inference wrapper
│   │   └── risk_model.pkl        # Serialized model artifact
│   └── genai/
│       ├── onboarding.py         # Multi-turn profile synthesis logic
│       ├── policy_qa.py          # ChromaDB vector retrieval + Groq LLM
│       └── mitigation.py         # Policy-verified intervention synthesizer
│
├── ml/                           # Data Science & RAG Ingestion Pipeline
│   ├── train_model.py            # Model training & serialization script
│   ├── hr_data.csv               # Historical HR workforce dataset
│   ├── policy_docs/              # Markdown & TXT corporate handbooks
│   │   ├── code_of_conduct.txt
│   │   ├── leave_policy.txt
│   │   ├── wfh_policy.txt
│   │   └── expense_policy.txt
│   ├── chroma_db/                # Local vector database store (generated)
│   └── policy_qa.py              # Standalone ingestion & query utility
│
├── tests/
│   └── test_backend.py           # Pytest test suite (100% passing)
│
├── .env.example                  # Template for required environment keys
├── requirements.txt              # Python dependencies
└── README.md                     # Platform documentation
```

---

## 🔌 API Specification & Contracts

### 1. Workforce & Employee Directory
- `GET /employees` — Returns list of all active employee profiles with department and tenure filters.
- `GET /employees/{id}` — Returns complete employee profile with compensation metrics and telemetry.
- `POST /employees` — Creates a new employee record and computes baseline risk.
- `PUT /employees/{id}` — Updates employee information and triggers model re-scoring.
- `DELETE /employees/{id}` — Archives employee profile from active directory.

### 2. Explainable Risk Engine
- `GET /risk/{id}` — Returns computed flight probability, risk categorization (`Low`, `Medium`, `High`), and mathematical SHAP drivers:
  ```json
  {
    "employee_id": "EMP001",
    "riskScore": 0.74,
    "riskLevel": "High",
    "summary": "Elevated flight probability driven by chronic overtime burden and stagnated promotion interval.",
    "reasons": [
      "+0.28: 14.5 hrs/week overtime exceeds department safe ceiling",
      "+0.19: 22 months elapsed since last promotion review",
      "+0.11: Compa-ratio 0.88 is below the 50th percentile for Level 4"
    ],
    "protectiveFactors": [
      "-0.15: Top quartile performance rating (4.6/5.0)",
      "-0.08: High engagement score on Q3 pulse survey (78/100)"
    ]
  }
  ```

### 3. Department Rollups
- `GET /teams/{department}/risk-summary` — Aggregates team size, average attrition risk, burnout alerts, and high-risk employee rosters.

### 4. Policy Q&A & Generative AI
- `POST /policy/ask` — Semantic retrieval over corporate handbooks returning grounded guidance with citations:
  ```json
  {
    "question": "Can an employee request 3 consecutive weeks of remote work during personal exigencies?",
    "answer": "Yes. Under Section 4.2 of the Remote & Flexible Work Policy (POL-HR-WFH-2026-V3), employees in good standing may request up to 30 continuous calendar days of remote work with approval from their Tier 1 Manager and Department Head.",
    "policy_source": "POL-HR-WFH-2026-V3 (Section 4.2: Extended Remote Protocols)",
    "confidence": 0.94
  }
  ```
- `POST /onboarding/chat` — Natural language chat endpoint that updates candidate profiles dynamically.
- `GET /mitigation/{id}` — Generates policy-checked retention proposals based on an employee's exact SHAP breakdown.

---

## ⚙️ Quickstart & Local Setup

### Prerequisites
- **Python:** 3.10, 3.11, or 3.13
- **Node.js:** v18+ and `npm`
- **Git**

### 1. Clone & Set Up Environment

```bash
git clone https://github.com/curious-coders/nirnaya-ai.git
cd nirnaya-ai

# Copy environment configuration
cp .env.example .env
```

Edit `.env` and provide your Groq API key (optional for core features, uses intelligent mock responses if unset):
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
DATABASE_URL=sqlite:///./nirnaya.db
PORT=8000
```

### 2. Backend Setup & Run

```bash
# Create and activate Python virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed 16 comprehensive demo profiles
python -m backend.seed

# Optional: Regenerate ChromaDB vector embeddings
python ml/policy_qa.py

# Launch FastAPI development server
uvicorn backend.main:app --reload --port 8000
```

The FastAPI backend will be live at:
- **API Server:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **Alternative ReDoc Docs:** `http://localhost:8000/redoc`

### 3. Frontend Setup & Run

In a separate terminal window:

```bash
cd frontend

# Install npm packages
npm install

# Start Vite development server
npm run dev
```

The frontend application will be live at:
- **Web App:** `http://localhost:3000`

---

## 🧪 Testing & Verification

Run the comprehensive automated test suite verifying database models, CRUD operations, risk scoring, and API response contracts:

```bash
# Run backend pytest suite
python -m pytest tests/test_backend.py -v
```

Expected output:
```text
tests/test_backend.py::test_root_endpoint PASSED                         [ 12%]
tests/test_backend.py::test_get_employees PASSED                         [ 25%]
tests/test_backend.py::test_create_employee PASSED                       [ 37%]
tests/test_backend.py::test_risk_prediction PASSED                       [ 50%]
tests/test_backend.py::test_team_risk_summary PASSED                     [ 62%]
tests/test_backend.py::test_policy_qa_endpoint PASSED                    [ 75%]
tests/test_backend.py::test_onboarding_chat PASSED                       [ 87%]
tests/test_backend.py::test_mitigation_action PASSED                     [100%]
============================== 8 passed in 2.65s ==============================
```

Build the production frontend bundle to verify zero compilation or stylesheet errors:

```bash
cd frontend
npm run build
```

---

## 🎨 Design Philosophy & Color System

Nirnaya.ai adopts an editorial, high-trust visual identity inspired by **Noovotic**:
- **Parchment Canvas (`#FBF4EF` / `#FAF6F2`):** Warm, paper-like background that eliminates screen fatigue during intensive HR evaluations.
- **Deep Espresso Charcoal (`#312C29`):** Authoritative, ultra-readable typography and primary interactive surfaces.
- **Terracotta Orange (`#D9684C`):** Highlighting key callouts, model metrics, critical risk indicators, and active workflow states.
- **Soft Muted Borders (`#DED1C9`):** Subtle organic card enclosures ensuring clean separation without harsh lines.
- **Monochrome Architectural Imagery:** Clean black-and-white editorial photography reflecting enterprise seriousness.

---

## 👥 Hackathon Team & Credits

**Team Curious Coders**  
*Department of Computer Science & Engineering*  
**Dayananda Sagar College of Engineering (DSCE), Bengaluru**

- **Project Lead & Full-Stack Architecture:** Team Curious Coders
- **Machine Learning & SHAP Formulation:** Team Curious Coders
- **Generative AI & Policy Vector Retrieval:** Team Curious Coders
- **Frontend & Editorial UX Engineering:** Team Curious Coders

---

## 📄 License & Attribution

Developed for the **DSCE Hackathon 2026** under the *AI in Human Resources & Workforce Intelligence* track.  
All brand assets, design tokens, and model configurations are maintained by Team Curious Coders.
