# Nirnaya.ai — AI-Driven Workforce Intelligence Platform

> **From workforce data to explainable, actionable HR decisions.**

**Team:** Curious Coders
**College:** Dayananda Sagar College of Engineering (DSCE), Bengaluru
**Theme:** AI in HR & Workforce Management

---

## 📌 Overview

**Nirnaya.ai** is an AI-driven workforce intelligence platform designed to help HR teams identify employee attrition risks, understand the factors behind those risks, and take policy-compliant actions.

Traditional HR systems often operate through disconnected tools for onboarding, performance tracking, employee skills, engagement, and company policies. Because these systems are not connected, HR teams often discover workforce risks only after they become serious problems.

Nirnaya.ai brings these signals together into a unified intelligence layer that can:

* Analyze employee workforce data
* Predict attrition risk
* Explain **why** an employee may be at risk
* Answer HR policy-related questions using internal documents
* Recommend appropriate and policy-compliant interventions
* Provide employee-level and team-level workforce insights

The goal is not simply to display HR data, but to turn it into **explainable and actionable intelligence**.

---

# 🎯 Problem Statement

HR teams manage multiple aspects of the employee lifecycle through disconnected systems:

* Hiring and onboarding
* Performance
* Skills
* Engagement
* Promotions
* Work-life balance
* Company policies

These systems rarely communicate with each other effectively.

As a result:

> **HR teams often react to employee problems instead of identifying risks early.**

For example, an employee experiencing declining engagement, excessive overtime, and a long period without promotion may represent an elevated attrition risk. Traditional dashboards may display these individual metrics, but they do not necessarily connect them into an understandable risk signal.

Nirnaya.ai addresses this gap by combining workforce signals with AI-powered reasoning and explainability.

---

# 💡 Our Solution

Nirnaya.ai provides a connected AI workflow:

```text
Employee & HR Data
        │
        ▼
┌──────────────────────────┐
│   Workforce Intelligence │
│          Layer           │
└────────────┬─────────────┘
             │
             ├── Risk Prediction
             ├── SHAP Explainability
             ├── Policy RAG
             ├── GenAI Reasoning
             └── Mitigation Logic
             │
             ▼
┌──────────────────────────┐
│ Explainable Workforce    │
│       Insights           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│ Policy-Compliant Actions │
└──────────────────────────┘
```

Instead of only answering:

> **"Who is at risk?"**

Nirnaya.ai aims to answer:

> **"Who is at risk, why are they at risk, and what can HR do about it within company policy?"**

---

# ⭐ Key Features

| Feature                        | Status         | Description                                                              |
| ------------------------------ | -------------- | ------------------------------------------------------------------------ |
| 🤖 **AI Onboarding Agent**     | 🚧 In Progress | Conversational employee onboarding with automatic profile extraction     |
| 📊 **Risk Reasoning Panel**    | ✅ Completed    | Explainable attrition risk scoring using XGBoost + SHAP                  |
| 🛡️ **Risk Mitigation Engine** | ⏳ Pending      | Generates policy-checked recommendations for identified risks            |
| 📚 **Policy Q&A**              | ✅ Completed    | Answers HR policy questions using ChromaDB + Groq with source references |
| 📈 **HR Dashboard**            | ⏳ Pending      | Employee-level details and team-level workforce risk visualization       |

---

# 🧠 Core Intelligence Pipeline

Nirnaya.ai follows a multi-stage intelligence pipeline.

### 1. Data Collection

Employee information is collected from sources such as:

* Onboarding conversations
* Employee profiles
* Performance indicators
* Engagement scores
* Skills
* Overtime
* Promotion history
* Work-life balance

### 2. Risk Prediction

The workforce data is passed through an **XGBoost classification model** to estimate employee attrition risk.

### 3. Explainability

**SHAP (SHapley Additive exPlanations)** is used to identify the factors contributing to an individual prediction.

Example:

```text
Risk Level: High

Contributing Factors:
• High overtime hours
• Low engagement score
• Long time since promotion

Protective Factors:
• High job level
• Strong skill coverage
```

### 4. Policy Intelligence

Company policy documents are converted into searchable embeddings and stored in **ChromaDB**.

When an HR user asks a policy question, the system retrieves relevant policy information and uses the Groq-hosted LLM to generate a cited response.

### 5. Mitigation

The planned mitigation engine will combine:

```text
Employee Risk Factors
        +
Company Policies
        +
GenAI Reasoning
        ↓
Policy-Compliant Recommendation
```

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │     HR / Manager     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React Dashboard   │
                         │    + Tailwind CSS   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    FastAPI Backend  │
                         └──────────┬──────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
    ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
    │  Risk Engine   │    │  GenAI Engine  │    │  Employee Data │
    │ XGBoost + SHAP │    │  Groq + RAG    │    │  PostgreSQL    │
    └───────┬────────┘    └───────┬────────┘    └────────────────┘
            │                     │
            │              ┌──────┴─────────┐
            │              │                │
            │              ▼                ▼
            │       ┌──────────────┐  ┌──────────────┐
            │       │   ChromaDB   │  │ HR Policies  │
            │       │ Vector Store │  │   Documents  │
            │       └──────────────┘  └──────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Explainable Risk    │
    │    Intelligence     │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Recommended Actions │
    │   + Policy Check     │
    └─────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer                 | Technology                  | Status        |
| --------------------- | --------------------------- | ------------- |
| **Frontend**          | React + Tailwind CSS        | ⏳ Not Started |
| **Backend**           | Python + FastAPI            | ✅ Working     |
| **Database**          | PostgreSQL + SQLAlchemy     | ✅ Working     |
| **Database Fallback** | SQLite                      | ✅ Available   |
| **Risk Model**        | XGBoost                     | ✅ Working     |
| **Explainability**    | SHAP                        | ✅ Working     |
| **GenAI**             | Groq API                    | ✅ Integrated  |
| **LLM**               | `openai/gpt-oss-120b`       | ✅ In Use      |
| **Policy RAG**        | ChromaDB                    | ✅ Working     |
| **Policy Documents**  | TXT-based internal policies | ✅ Available   |

### Risk Model

```text
Employee Features
       ↓
XGBoost Classifier
       ↓
Attrition Risk Score
       ↓
SHAP Explainability
       ↓
Risk Factors + Protective Factors
```

**Current reported model accuracy:** ~84%

> Model accuracy is based on the current training/evaluation setup and should not be interpreted as production-level validation.

---

# 📁 Project Structure

```text
nirnaya-ai/
│
├── frontend/
│   └── ⏳ React frontend — not started
│
├── backend/
│   │
│   ├── __init__.py
│   ├── main.py
│   ├── schemas.py
│   ├── seed.py
│   │
│   ├── database/
│   │   ├── db.py
│   │   └── models.py
│   │
│   ├── routes/
│   │   ├── employee_routes.py
│   │   ├── risk_routes.py
│   │   ├── team_routes.py
│   │   └── genai_routes.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── risk_model.py
│   │   └── risk_model.pkl
│   │
│   └── genai/
│       ├── onboarding.py
│       ├── policy_qa.py
│       └── mitigation.py
│
├── ml/
│   │
│   ├── train_model.py
│   ├── notebook.ipynb
│   ├── hr_data.csv
│   │
│   ├── policy_docs/
│   │   ├── leave_policy.txt
│   │   ├── wfh_policy.txt
│   │   ├── expense_policy.txt
│   │   └── code_of_conduct.txt
│   │
│   ├── chroma_db/
│   ├── policy_qa.py
│   ├── onboarding_agent.py
│   ├── test_llm.py
│   ├── list_models.py
│   └── check_chunks.py
│
├── docs/
│   └── api-contract.md
│
├── tests/
│   └── test_backend.py
│
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

# 👥 Team Development Rules

To avoid merge conflicts and accidental changes:

> **Each team member works only inside their assigned folder.**

### Shared Files

Only the following files are considered shared:

```text
backend/main.py
backend/schemas.py
```

If a shared file needs to be modified:

1. Make the required change.
2. Commit immediately.
3. Push the changes.
4. Inform the team in the group chat.

This keeps the development workflow predictable during the hackathon.

---

# 🧩 Employee Data Schema

The current shared employee object follows this structure:

```json
{
  "id": "string",
  "name": "string",
  "role": "string",
  "department": "string",
  "tenure_months": 0,
  "engagement_score": 0.0,
  "time_since_promotion_months": 0,
  "overtime_hours": 0.0,
  "JobLevel": 0,
  "WorkLifeBalance": 0,
  "skills": [
    "string"
  ],
  "riskScore": 0.0,
  "riskLevel": "Low | Medium | High",
  "summary": "string",
  "reasons": [
    "string"
  ],
  "protectiveFactors": [
    "string"
  ],
  "recommendedAction": "string"
}
```

---

# 🔌 API Contract

| Method | Endpoint                           | Status                 | Description                                                    |
| ------ | ---------------------------------- | ---------------------- | -------------------------------------------------------------- |
| `GET`  | `/employees`                       | ✅ Working              | Returns all employees                                          |
| `GET`  | `/employees/{id}`                  | ✅ Working              | Returns a single employee                                      |
| `POST` | `/employees`                       | ✅ Working              | Creates an employee                                            |
| `PUT`  | `/employees/{id}`                  | ✅ Working              | Updates an employee                                            |
| `GET`  | `/risk/{id}`                       | ✅ Working              | Returns employee risk analysis                                 |
| `GET`  | `/teams/{department}/risk-summary` | ✅ Working              | Returns team-level risk summary                                |
| `POST` | `/onboarding/chat`                 | 🚧 In Progress         | Converts onboarding conversation into structured employee data |
| `POST` | `/policy/ask`                      | 🚧 Integration Pending | Answers HR policy questions using RAG                          |
| `GET`  | `/mitigation/{id}`                 | ⏳ Planned              | Returns recommended action and policy reference                |

### Risk API Response

```json
{
  "riskScore": 0.78,
  "riskLevel": "High",
  "summary": "Employee shows multiple indicators associated with elevated attrition risk.",
  "reasons": [
    "High overtime hours",
    "Low engagement score",
    "Long time since promotion"
  ],
  "protectiveFactors": [
    "Strong skill coverage",
    "High job level"
  ]
}
```

---

# 🤖 GenAI Architecture

Nirnaya.ai uses **Groq** for its generative AI workflows.

### Current Model

```text
Groq API
   ↓
openai/gpt-oss-120b
```

The GenAI layer consists of three major capabilities.

## 1. Onboarding Agent

```text
Employee ↔ Conversational Agent
              ↓
       Structured Information
              ↓
        Employee JSON
              ↓
         HR Database
```

The agent extracts structured employee information from natural-language conversations.

## 2. Policy Q&A

```text
HR Question
     ↓
Document Retrieval
     ↓
ChromaDB
     ↓
Relevant Policy Chunks
     ↓
Groq LLM
     ↓
Answer + Source
```

## 3. Mitigation Engine

```text
Employee Risk
     +
Risk Factors
     +
Company Policies
     ↓
GenAI Reasoning
     ↓
Policy Validation
     ↓
Recommended HR Action
```

---

# 📚 Policy Intelligence

The policy knowledge base currently contains:

* Leave Policy
* Work From Home Policy
* Expense Policy
* Code of Conduct

Policy documents are chunked and converted into vector representations before being stored in ChromaDB.

The system retrieves relevant policy sections before generating an answer.

### Example

```text
Question:
"Can an employee request work from home temporarily?"
        ↓
ChromaDB Retrieval
        ↓
Relevant WFH Policy Sections
        ↓
Groq LLM
        ↓
Answer + Policy Source
```

The local `chroma_db/` directory is intentionally excluded from Git and can be regenerated locally.

---

# 📊 Workforce Risk Intelligence

The risk engine produces three primary outputs.

### Risk Score

A numerical estimate representing the model's predicted attrition risk.

### Risk Level

The score is mapped into a human-readable category:

```text
Low
Medium
High
```

### Explanation

SHAP identifies the features that contributed to the model's prediction.

This allows HR users to see the factors behind a prediction instead of only viewing a numerical risk score.

---

# 🔐 Security & Configuration

Sensitive configuration is stored locally using environment variables.

### `.env`

```text
GROQ_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

### Important

> **Never commit `.env` or API keys to GitHub.**

The repository contains `.env.example` as a safe template for required configuration.

---

# ⚙️ Local Development

## 1. Clone the Repository

```bash
git clone <repository-url>
cd nirnaya-ai
```

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Configure Environment Variables

Create a `.env` file based on `.env.example`.

```text
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_database_url
```

## 5. Start the Backend

```bash
uvicorn backend.main:app --reload --port 8000
```

Backend:

```text
http://localhost:8000
```

## 6. Seed Demo Data

```bash
python -m backend.seed
```

The seed script currently creates **16 demo employees**.

## 7. Regenerate Policy Vector Store

```bash
python ml/policy_qa.py
```

This regenerates the local ChromaDB vector store from the policy documents.

---

# 🌐 Development Configuration

| Component | Local Address           |
| --------- | ----------------------- |
| Frontend  | `http://localhost:3000` |
| Backend   | `http://localhost:8000` |

FastAPI automatically provides interactive API documentation at:

```text
http://localhost:8000/docs
```

---

# 🌿 Git Workflow

Each contributor should work on their own feature branch.

### Example Branches

```text
feature/frontend-dashboard
feature/backend-routes
feature/ml-risk-model
feature/genai-onboarding
```

### Recommended Workflow

```bash
git pull

git checkout -b feature/your-feature

# Make changes

git add .

git commit -m "feat: add employee risk analysis"

git push origin feature/your-feature
```

### Development Guidelines

* Pull before starting work each day.
* Keep commits small and focused.
* Avoid modifying another contributor's workspace.
* Do not commit secrets.
* Do not commit generated ChromaDB files.
* Coordinate changes to shared files through the team.

---

# 🧪 Testing

Backend tests are located in:

```text
tests/test_backend.py
```

The test suite is currently present and will be expanded as additional API functionality is implemented.

---

# 🗓️ Development Roadmap

| Day       | Planned Work                                     | Current Status                                    |
| --------- | ------------------------------------------------ | ------------------------------------------------- |
| **Day 1** | Project setup, dataset, schema, policy documents | ✅ Completed                                       |
| **Day 2** | Risk model + Employee CRUD                       | ✅ Completed                                       |
| **Day 3** | Onboarding Agent + Policy Q&A                    | 🚧 Policy Q&A completed; Onboarding in progress   |
| **Day 4** | Mitigation Engine + Team Intelligence            | ⏳ Mitigation pending; team rollup completed early |
| **Day 5** | Frontend + Backend Integration                   | ⏳ Pending                                         |
| **Day 6** | Feedback loop, demo data, testing & polish       | ⏳ Pending                                         |
| **Day 7** | Final deck, demo & rehearsal                     | ⏳ Pending                                         |

---

# 🚀 Current Progress

### Completed

* ✅ FastAPI backend
* ✅ PostgreSQL integration
* ✅ SQLite fallback
* ✅ Employee CRUD APIs
* ✅ Employee database model
* ✅ XGBoost risk model
* ✅ SHAP explainability
* ✅ Employee risk API
* ✅ Team-level risk summary
* ✅ Policy document ingestion
* ✅ ChromaDB vector search
* ✅ Groq API integration
* ✅ Policy Q&A pipeline
* ✅ Demo employee seeding

### In Progress

* 🚧 AI onboarding agent
* 🚧 GenAI route integration
* 🚧 Frontend development

### Planned

* ⏳ Risk mitigation engine
* ⏳ Policy-checked recommendations
* ⏳ HR dashboard
* ⏳ Full frontend-backend integration
* ⏳ Testing and refinement
* ⏳ Final demo workflow

---

# 🔮 Future Scope

Nirnaya.ai can be extended with:

* Continuous employee engagement monitoring
* Feedback-loop based model improvement
* Workforce forecasting
* Role-specific skill-gap analysis
* Personalized learning recommendations
* HR workflow automation
* Additional enterprise policy sources
* Audit logs for AI-generated recommendations
* Role-based access control
* Model monitoring and drift detection
* Integration with existing HRMS platforms

---

# 🎯 Vision

Nirnaya.ai aims to build an intelligent workforce layer that connects:

```text
People
  +
Workforce Data
  +
AI
  +
Company Policies
        ↓
Explainable Workforce Intelligence
        ↓
Actionable HR Decisions
```

The platform is built around one principle:

> **Don't just show HR data. Help HR understand it.**

---

# 👨‍💻 Team

## Curious Coders

**Dayananda Sagar College of Engineering (DSCE), Bengaluru**

### Project Theme

**AI in HR & Workforce Management**

---

# 📄 License

This project is developed as a hackathon/academic project.

See the repository for the applicable license and usage terms.
