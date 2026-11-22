# Nirnaya.ai — Frontend Web Application

AI-driven workforce intelligence platform frontend built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, and **Lucide React**.

**Team:** Curious Coders  
**College:** Dayananda Sagar College of Engineering (DSCE), Bengaluru  
**Theme:** AI in HR & Workforce Management  

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended, verified on v22.15.0)
- npm (v9+)
- Python 3.10+ (for backend)

### 2. Environment Variables
Create a `.env` file in the `frontend/` directory (or copy from `.env.example`):

```bash
VITE_API_URL=http://localhost:8000
```

### 3. Installation
Install the project dependencies:

```bash
cd frontend
npm install
```

### 4. Running the Development Server
Start the Vite development server (configured on port 3000):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Production Build
To create an optimized production build:

```bash
npm run build
npm run preview
```

---

## 👥 Role Gating & Personas

Nirnaya.ai implements role-based access control (RBAC):

1. **Employee** (`rahul_dev`):
   - Access to **Conversational Onboarding Agent** (`/onboarding`)
   - Access to **Policy Q&A Assistant** (`/policy`)

2. **HR Staff** (`aditi_hr`):
   - Access to **Workforce Risk Dashboard** (`/dashboard`)
   - Access to **Employee Detail & SHAP Risk Reasoning Panel** (`/employees/:id`)
   - Access to **Department Risk Rollup Analytics** (`/teams`)
   - Access to **Policy Q&A Assistant** (`/policy`)

3. **HR Admin** (`vikram_admin`):
   - Everything available to HR Staff
   - Full **Employee Directory Management** (`/admin/employees`) with Create, Edit, Delete capabilities and ML feature calibration

---

## 📁 Project Architecture

```
frontend/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api/
    │   └── api.js              # Centralized Axios API wrapper + Fallback Knowledge Base
    ├── context/
    │   ├── AuthContext.jsx     # Role-based authentication & persona switching
    │   └── ToastContext.jsx    # Alert toast notifications
    ├── components/
    │   ├── Layout.jsx          # Role-aware sidebar, header & team branding
    │   ├── ProtectedRoute.jsx  # Route-level RBAC gating
    │   ├── RiskBadge.jsx       # Low/Medium/High visual risk badge
    │   ├── RiskGauge.jsx       # Visual percentage meter & threshold ticks
    │   ├── LoadingSkeleton.jsx # Shimmer skeletons for tables, cards, & details
    │   └── ErrorMessage.jsx    # Friendly error presentation with retry action
    └── pages/
        ├── LoginPage.jsx       # UI-01: Persona selection & instant demo login
        ├── DashboardPage.jsx   # UI-03: Filterable employee list with risk indicators
        ├── EmployeeDetailPage.jsx # UI-03: SHAP Explainability & Mitigation card
        ├── TeamViewPage.jsx    # UI-04: Department aggregate analytics with Recharts
        ├── PolicyQAPage.jsx    # UI-05: RAG Policy Q&A chat with document citations
        ├── OnboardingPage.jsx  # UI-02: Conversational onboarding & structured card
        ├── EmployeeManagementPage.jsx # UI-06: HR Admin CRUD directory
        └── NotFoundPage.jsx
```
