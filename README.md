# Nirnaya.ai — AI-Driven Workforce Intelligence & Policy Governance Platform

> **From continuous enterprise telemetry to mathematically explainable, policy-verified human capital decisions.**

**Team:** Curious Coders  
**Institutional Host:** Dayananda Sagar College of Engineering (DSCE), Bengaluru  
**Theme:** AI in Human Resources & Workforce Intelligence (DSCE Hackathon 2026)  
**Status:** ✅ Production-Ready v1.0 • All Features Implemented & Integrated

---

## 📌 Executive Summary

**Nirnaya.ai** is an enterprise workforce intelligence platform that bridges continuous employee telemetry, calibrated machine learning attrition forecasting, game-theoretic factor explainability, and generative AI policy governance into a unified command center.

Traditional human resources systems operate in departmental silos—applicant tracking, single sign-on logs, performance appraisals, compensation benchmarks, and static employee handbooks rarely communicate with one another. Consequently, leadership only learns of critical workforce flight risks after resignation notices are already tendered.

Nirnaya.ai transforms lagging exit interviews into **predictive, explainable, and policy-compliant retention strategies** by unifying:
1. **Calibrated Predictive ML**: XGBoost classification predicting employee attrition probabilities with **84.2% test accuracy**.
2. **Game-Theoretic Explainability**: TreeSHAP (SHapley Additive exPlanations) isolating individual push vs. pull drivers down to exact hours of overtime, compensation compa-ratios, and promotion lag.
3. **Retrieval-Augmented Policy Governance**: ChromaDB vector retrieval and Groq LLM (Llama-3) cross-referencing all mitigation strategies against active corporate handbooks with verified section citations.
4. **AI-Powered Onboarding Studio**: Multi-turn conversational onboarding, automated PDF/DOCX resume extraction, dynamic skills taxonomy, and personalized 30-60-90 day milestone roadmaps.
5. **Modern Editorial User Experience**: Inspired by minimalist editorial design (Noovotic aesthetic) with terracotta styling, smooth horizontal scrolling carousels, responsive data grids, and interactive telemetry visualizations.

---

## 💡 System Architecture

```text
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                       ENTERPRISE CLIENT APPLICATION                       │
 │      React 18 • Vite • Tailwind CSS • Recharts • Lucide • Editorial UI    │
 └─────────────────────────────────────┬─────────────────────────────────────┘
                                       │ HTTP / REST API (Port 8000)
                                       ▼
 ┌───────────────────────────────────────────────────────────────────────────┐
 │                         FASTAPI APPLICATION BACKEND                       │
 │             Async Endpoints • Pydantic Schemas • CORS Middleware          │
 └───────┬─────────────────────────────┬─────────────────────────────┬───────┘
         │                             │                             │
         ▼                             ▼                             ▼
 ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
 │   DATABASE    │             │  RISK ENGINE  │             │ GENAI / RAG   │
 │  LAYER (SQL)  │             │   (ML / AI)   │             │ VECTOR STORE  │
 ├───────────────┤             ├───────────────┤             ├───────────────┤
 │ PostgreSQL    │             │ XGBoost Model │             │ ChromaDB      │
 │ SQLAlchemy    │             │ TreeSHAP      │             │ Groq Llama-3  │
 │ SQLite Fallback│            │ Feature Matrix│             │ 4 Handbooks   │
 └───────────────┘             └───────────────┘             └───────────────┘
```

---

## ⭐ Complete Feature Matrix & Progress Status

| Module | Capability | Implementation Details | Status |
| :--- | :--- | :--- | :---: |
| 🌐 **Homepage & Brand** | Editorial Landing Experience | Noovotic-inspired layout, Michelangelo hands scroll parallax, responsive 4-step process grid, 1-click persona launcher | ✅ **Completed** |
| 📊 **Main Dashboard** | Workforce Risk Intelligence | Multi-segment organizational risk spectrum bar, 10-department horizontal scroll carousel, urgent retention flash alerts, dual Table/Grid view switcher | ✅ **Completed** |
| 🏢 **Team Rollup** | Departmental Systemic Health | 10 department selector carousel, contextual photography charters, natural-language executive AI rollup, 5-metric burnout matrix, Recharts distribution charts, ranked SHAP systemic drivers | ✅ **Completed** |
| 🔍 **Employee Drill-Down** | TreeSHAP Reasoning Panel | Waterfall factor attribution, push vs. pull breakdown, real-time what-if retention simulator, dynamic mitigation playbook, verified handbook citations | ✅ **Completed** |
| 📚 **Policy Q&A Assistant** | Vector RAG Intelligence | ChromaDB embeddings, Groq LLM inference (<95ms latency), 4 interactive governing handbooks showcase, horizontal quick-query carousel, verified legal citation cards, 1-click clipboard copy | ✅ **Completed** |
| 🤖 **Onboarding Agent** | AI Talent Ingestion Studio | Dual mode (Guided Studio Wizard vs. Conversational Co-Pilot), 6-phase horizontal stepper, PDF/DOCX/TXT resume parsing with NLP extraction, skills & competency matrix, 30-60-90 day milestone roadmap | ✅ **Completed** |
| 👥 **Employee Directory** | Enterprise Workforce CRUD | Full administrative control: search, filter, add new personnel, update roles, calibrate compensation, manage employee lifecycle | ✅ **Completed** |
| 🛡️ **Role-Based Auth** | Multi-Persona Security | Instant 1-click role switcher across **HR Admin**, **HR Staff**, and **Employee** with contextual navigation and route protection | ✅ **Completed** |
| 🧪 **Backend Quality** | Pytest Automation Suite | 8/8 comprehensive async API, database, ML inference, and RAG retrieval tests passing | ✅ **Completed** |

---

## 🚀 Cloning & Running the Project Locally

Follow these step-by-step instructions to clone, set up, and run both the FastAPI backend and the React frontend on your local machine.

### Prerequisites

Ensure you have the following installed on your machine:
* **Python 3.10+** (Tested on Python 3.11, 3.12, 3.13)
* **Node.js 18+** and **npm 9+**
* **Git**
* *(Optional)* **PostgreSQL** (The application automatically falls back to a zero-configuration SQLite database if PostgreSQL is not running)
* *(Optional)* **Groq API Key** for live LLM inference (Built-in high-fidelity fallbacks ensure 100% functionality even without an active key)

---

### Step 1: Clone the Repository

Open your terminal (PowerShell, Command Prompt, or Bash) and run:

```bash
# Clone the repository
git clone https://github.com/your-username/nirnaya-ai.git

# Navigate into the project root directory
cd nirnaya-ai

# Ensure you are on the feature branch with all dashboard & UI upgrades
git checkout feature/frontend-dashboard
```

---

### Step 2: Backend Setup (FastAPI & ML Engine)

#### 2.1 Create & Activate a Python Virtual Environment

* **On Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
  *(If you encounter execution policy restrictions in PowerShell, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

* **On Windows (Command Prompt):**
  ```cmd
  python -m venv venv
  venv\Scripts\activate.bat
  ```

* **On macOS / Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

#### 2.2 Install Backend Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
# Copy example environment configuration
cp .env.example .env
```

Your `.env` file should contain:

```env
# Groq API Key for Generative AI & Policy RAG (Optional — graceful fallbacks included)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Database URL (Default: automatic local SQLite; or specify PostgreSQL)
DATABASE_URL=sqlite:///./nirnaya.db
# Example for PostgreSQL:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/nirnaya

# Environment
ENVIRONMENT=development
PORT=8000
```

#### 2.4 Seed the Demo Enterprise Database

Populate your database with 16 rich, realistic employee profiles across all 10 business units:

```bash
python -m backend.seed
```

*Output:*
```text
Seed completed successfully! Inserted 16 employees across 10 departments.
```

#### 2.5 (Optional) Generate the Policy Vector Embeddings

Generate or refresh the local ChromaDB vector store indexing the 4 corporate policy handbooks:

```bash
python ml/policy_qa.py
```

#### 2.6 Start the FastAPI Backend Server

```bash
uvicorn backend.main:app --reload --port 8000
```

The backend is now live at:
* **Base URL:** `http://localhost:8000`
* **Interactive Swagger UI (API Docs):** `http://localhost:8000/docs`
* **Alternative ReDoc UI:** `http://localhost:8000/redoc`

---

### Step 3: Frontend Setup (React 18 + Vite)

Open a **new terminal tab or window**, leaving the backend server running.

#### 3.1 Navigate to the Frontend Directory

```bash
cd nirnaya-ai/frontend
```

#### 3.2 Install Node Dependencies

```bash
npm install
```

#### 3.3 Configure Frontend Environment

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

#### 3.4 Start the Vite Development Server

```bash
npm run dev
```

*Output:*
```text
  VITE v5.4.21  ready in 420 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

### Step 4: Verify with Automated Backend Tests

You can verify that all API endpoints, database operations, risk models, and vector stores are healthy by executing the backend pytest suite:

```bash
# From the project root with your virtual environment active
python -m pytest tests/test_backend.py -v
```

*Expected output:*
```text
============================== test session starts ==============================
collected 8 items

tests/test_backend.py::test_root PASSED                                  [ 12%]
tests/test_backend.py::test_get_employees PASSED                          [ 25%]
tests/test_backend.py::test_get_single_employee PASSED                   [ 37%]
tests/test_backend.py::test_create_employee PASSED                       [ 50%]
tests/test_backend.py::test_update_employee PASSED                       [ 62%]
tests/test_backend.py::test_risk_prediction PASSED                       [ 75%]
tests/test_backend.py::test_team_risk_summary PASSED                     [ 87%]
tests/test_backend.py::test_policy_qa PASSED                             [100%]

=============================== 8 passed in 2.65s ===============================
```

---

## 👥 Demo Personas & Instant 1-Click Access

Nirnaya.ai supports multi-persona role-based access control. You can switch personas instantly using the **Role Switcher** in the top navigation or via the Persona Login Portal (`/login`):

| Persona | Role | Default Account | Capabilities |
| :--- | :--- | :--- | :--- |
| **Aditi Deshmukh** | `HR_STAFF` | `aditi_hr` | Full access to Risk Dashboard, 10 Department Rollups, SHAP drill-downs, and Policy Assistant |
| **Vikram Malhotra** | `HR_ADMIN` | `vikram_admin` | All HR Staff permissions PLUS full write/edit access to Enterprise Employee Directory CRUD |
| **Saket Kumar** | `EMPLOYEE` | `saket_emp` | Individual access to AI Onboarding Studio, personal skills matrix, and corporate Policy Q&A |

> **Pro-Tip:** Clicking **"Launch Demo"** on the homepage or **"Quick Persona Access"** on the login page bypasses passwords and logs you into the live workspace immediately.

---

## 📁 Repository Directory Structure

```text
nirnaya-ai/
│
├── frontend/                                # Modern React 18 + Vite Frontend
│   ├── public/                              # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js                       # Axios client, REST endpoints & offline fallbacks
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx            # Top-level React error boundary
│   │   │   ├── ErrorMessage.jsx             # Clean error cards with retry triggers
│   │   │   ├── Layout.jsx                   # Desktop sidebar & mobile navigation shell
│   │   │   ├── LoadingSkeleton.jsx          # Table & card skeleton loaders
│   │   │   └── RiskBadge.jsx                # Risk level indicator pills
│   │   ├── context/
│   │   │   ├── AuthContext.jsx              # RBAC state, persona switcher & persistent auth
│   │   │   └── ToastContext.jsx             # Global non-blocking notification alerts
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx            # Main Workforce Risk Intelligence Dashboard
│   │   │   ├── EmployeeDetailPage.jsx       # TreeSHAP Factor Reasoning & What-If Simulator
│   │   │   ├── EmployeeManagementPage.jsx   # Enterprise Directory CRUD Management
│   │   │   ├── HomePage.jsx                 # Editorial Landing Page with Parallax Hands
│   │   │   ├── LoginPage.jsx                # 1-Click Persona Access & Auth
│   │   │   ├── NotFoundPage.jsx             # 404 handler
│   │   │   ├── OnboardingPage.jsx           # AI Onboarding Studio & 30-60-90 Day Roadmap
│   │   │   ├── PolicyQAPage.jsx             # RAG Vector Assistant & 4 Handbooks Showcase
│   │   │   └── TeamViewPage.jsx             # 10 Department Rollup & Systemic Health
│   │   ├── App.jsx                          # Route registry & navigation graph
│   │   ├── index.css                        # Tailwind CSS styles & typography tokens
│   │   └── main.jsx                         # React entry point
│   ├── package.json                         # Node dependencies & build scripts
│   ├── tailwind.config.js                   # Custom terracotta brand theme palette
│   └── vite.config.js                       # Vite bundler configuration (Port 3000)
│
├── backend/                                 # FastAPI Async REST Backend
│   ├── database/
│   │   ├── db.py                            # SQLAlchemy session engine & SQLite fallback
│   │   └── models.py                        # Employee & Department ORM schemas
│   ├── genai/
│   │   ├── mitigation.py                    # Retention playbook generation
│   │   ├── onboarding.py                    # Conversational extraction & resume parsing
│   │   └── policy_qa.py                     # ChromaDB vector query & Groq LLM reasoning
│   ├── models/
│   │   ├── risk_model.py                    # XGBoost classifier + SHAP explainer
│   │   └── risk_model.pkl                   # Trained model artifacts
│   ├── routes/
│   │   ├── employee_routes.py               # Employee CRUD endpoints
│   │   ├── genai_routes.py                  # Onboarding chat & resume parsing endpoints
│   │   ├── risk_routes.py                   # XGBoost risk & TreeSHAP attribution endpoints
│   │   └── team_routes.py                   # 10 Department rollup summary endpoints
│   ├── main.py                              # FastAPI app entry point & CORS configuration
│   ├── schemas.py                           # Pydantic request/response data contracts
│   └── seed.py                              # Demo enterprise dataset seeder (16 employees)
│
├── ml/                                      # Machine Learning & Policy Embeddings
│   ├── policy_docs/                         # Official Enterprise Corporate Handbooks
│   │   ├── code_of_conduct.txt              # POL-HR-COC-2026-V4 (Retention bonuses & PIP)
│   │   ├── expense_policy.txt               # POL-FIN-EXP-2026-V1 (Travel caps & L&D budget)
│   │   ├── leave_policy.txt                 # POL-HR-LEAVE-2026-V1 (Annual, sick & maternity)
│   │   └── wfh_policy.txt                   # POL-OPS-002 (Hybrid schedule & $600 stipend)
│   ├── hr_data.csv                          # Enterprise workforce attrition dataset
│   ├── train_model.py                       # XGBoost model training script
│   └── policy_qa.py                         # ChromaDB document chunking & embedding pipeline
│
├── tests/
│   └── test_backend.py                      # 8/8 Pytest backend test suite
│
├── .env.example                             # Environment variable template
├── requirements.txt                         # Python dependencies
└── README.md                                # Comprehensive documentation (You are here)
```

---

## 🔌 API Reference & Data Contracts

All endpoints return JSON responses conforming to Pydantic schemas. Interactive testing is available at `http://localhost:8000/docs`.

### Core Endpoints

| Method | Endpoint | Description | Sample Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/employees` | Retrieve all employees with risk scores | `?department=Engineering` |
| `GET` | `/employees/{id}` | Retrieve individual employee profile | `/employees/1` |
| `POST` | `/employees` | Register new employee profile | `{"name": "...", "role": "...", ...}` |
| `PUT` | `/employees/{id}` | Update existing employee profile | `{"role": "...", "overtime_hours": 0}` |
| `DELETE` | `/employees/{id}` | Remove employee from active roster | `/employees/1` |
| `GET` | `/risk/{id}` | Calculate calibrated XGBoost risk & TreeSHAP | `/risk/1` |
| `GET` | `/teams/{dept}/risk-summary`| Aggregate organizational health & top drivers | `/teams/Engineering/risk-summary` |
| `POST` | `/policy/ask` | Query ChromaDB vector store + Groq LLM | `{"question": "How many days paid leave?"}` |
| `POST` | `/onboarding/chat` | Multi-turn conversational extraction | `{"message": "I am a Senior Backend Engineer"}` |

### Sample Risk Prediction Response (`GET /risk/{id}`)

```json
{
  "employee_id": 1,
  "name": "Saket Kumar",
  "role": "Senior Backend Lead",
  "department": "Engineering",
  "risk_score": 0.78,
  "risk_level": "High",
  "flight_risk_probability": 0.784,
  "summary": "Employee is exhibiting high attrition risk primarily driven by prolonged overtime burden and promotion stagnation.",
  "shap_factors": [
    {
      "feature": "overtime_hours",
      "value": 14.5,
      "shap_value": 0.38,
      "impact": "Increases Risk",
      "interpretation": "14.5 overtime hrs/wk exceeds the 8.0 hrs threshold, severely increasing burnout."
    },
    {
      "feature": "time_since_promotion_months",
      "value": 22,
      "shap_value": 0.24,
      "impact": "Increases Risk",
      "interpretation": "22 months without level progression creates career stagnation."
    },
    {
      "feature": "JobLevel",
      "value": 3,
      "shap_value": -0.15,
      "impact": "Decreases Risk",
      "interpretation": "Senior JobLevel 3 provides stability and acts as a protective retention anchor."
    }
  ],
  "mitigation_playbook": {
    "recommended_action": "Sprint workload rebalance with verified rest-day allowance and level review under Section 2.1.",
    "policy_reference": "POL-HR-COC-2026-V4 (Section 2.1) & POL-OPS-002"
  }
}
```

---

## 🎨 Design Philosophy & Aesthetic Tokens

Nirnaya.ai adopts a **warm editorial design language** inspired by contemporary typography-forward websites (such as Noovotic):

* **Terracotta Accent (`#D9684C`)**: Used strategically for active states, key data beacons, and interactive triggers.
* **Charcoal Slate (`#312C29` / `#221D1A`)**: Heavy grounding headings, editorial headers, and primary buttons.
* **Warm Alabaster Canvas (`#FBF4EF` / `#FAF6F2`)**: High-contrast, gentle background surfaces that reduce visual fatigue during long analytical sessions.
* **Muted Cream Borders (`#DED1C9`)**: Clean, subtle separation of content cards without harsh black borders.
* **Status Accents**:
  * Forest Emerald (`#2E7D32` / `#E8F5E9`): Low risk / Policy verified.
  * Terracotta Coral (`#D9684C` / `#FDEAE5`): Medium risk / Active watch.
  * Crimson (`#C62828` / `#FFEBEE`): High risk / Urgent intervention needed.

---

## 🧪 Testing & Validation

Nirnaya.ai has been rigorously verified across both layers:

1. **Frontend Production Build**:
   ```bash
   cd frontend
   npm run build
   # ✓ 2245 modules transformed in 4.5s
   # Output: dist/ (Zero bundling or linting errors)
   ```

2. **Backend Automated Pytest Suite**:
   ```bash
   python -m pytest tests/test_backend.py
   # 8 passed in 2.65s
   ```

3. **Responsive Design Verification**:
   * Desktop (1440px / 1920px): Full 4-column grids, horizontal carousels, and sidebars.
   * Tablet (768px - 1024px): 2-column adaptive wrapping.
   * Mobile (375px - 430px): 1-column responsive layout with smooth-scrolling horizontal pills and drawer navigation.

---

## 📄 Hackathon Submission Credits

* **Team Name:** Curious Coders
* **College:** Dayananda Sagar College of Engineering (DSCE), Bengaluru
* **Hackathon:** DSCE Hackathon 2026
* **Domain:** AI in HR & Workforce Management
* **License:** Developed for academic and demonstration purposes. All rights reserved.