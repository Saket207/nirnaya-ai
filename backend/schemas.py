from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

# ── Shared Employee Schemas ──────────────────────────────────────────────

class EmployeeBase(BaseModel):
    name: str
    role: str
    department: str
    tenure_months: int = 0
    engagement_score: float = 3.0
    time_since_promotion_months: int = 0
    overtime_hours: float = 0.0
    JobLevel: int = 1
    WorkLifeBalance: int = 3
    skills: List[str] = Field(default_factory=list)
    profile_details: Optional[dict] = Field(default_factory=dict)

class EmployeeCreate(BaseModel):
    name: str
    role: str
    department: str
    tenure_months: Optional[int] = 0
    engagement_score: Optional[float] = 3.0
    time_since_promotion_months: Optional[int] = 0
    overtime_hours: Optional[float] = 0.0
    JobLevel: Optional[int] = 1
    WorkLifeBalance: Optional[int] = 3
    skills: Optional[List[str]] = Field(default_factory=list)
    profile_details: Optional[dict] = Field(default_factory=dict)

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    tenure_months: Optional[int] = None
    engagement_score: Optional[float] = None
    time_since_promotion_months: Optional[int] = None
    overtime_hours: Optional[float] = None
    JobLevel: Optional[int] = None
    WorkLifeBalance: Optional[int] = None
    skills: Optional[List[str]] = None
    profile_details: Optional[dict] = None
    recommendedAction: Optional[str] = None

class EmployeeResponse(EmployeeBase):
    id: str
    riskScore: float = 0.0
    riskLevel: str = "Low"
    summary: str = ""
    reasons: List[str] = Field(default_factory=list)
    protectiveFactors: List[str] = Field(default_factory=list)
    recommendedAction: str = ""

    model_config = ConfigDict(from_attributes=True)


# ── Risk Mitigation Response Schema ──────────────────────────────────────

class MitigationRequest(BaseModel):
    employee_id: Optional[str] = None
    context: Optional[str] = None

class MitigationResponse(BaseModel):
    employee_id: str
    recommendedAction: str
    status: str = "success"
    note: str = "Placeholder response. GenAI teammate will connect backend/genai/mitigation.py"

    model_config = ConfigDict(from_attributes=True)


# ── Team Rollup Response Schema ──────────────────────────────────────────

class CommonRiskFactor(BaseModel):
    factor: str
    count: int

class TeamRiskSummaryResponse(BaseModel):
    department: str
    total_employees: int
    at_risk_count: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    common_risk_factors: List[CommonRiskFactor]
    summary: str

    model_config = ConfigDict(from_attributes=True)


# ── Enterprise Telemetry & Compensation Schema ───────────────────────────

class SSOTimesheet(BaseModel):
    provider: str
    last_sync: str
    today_login: str
    today_logout: str
    avg_checkin: str
    avg_checkout: str
    days_worked_this_month: int
    total_hours_this_month: float
    standard_hours_benchmark: int = 160
    overtime_hours_this_month: float
    work_schedule_status: str = "Nominal (40h/wk)"
    vpn_connected: bool = True

class SalaryRevision(BaseModel):
    date: str
    title: str
    salary: int
    hike_percentage: float

class CompensationTelemetry(BaseModel):
    payroll_provider: str
    current_salary: int
    previous_salary: int
    salary_delta_percentage: float
    last_revision_date: str
    months_without_salary_revision: int
    market_median_benchmark: int
    compa_ratio: float
    is_below_market: bool
    salary_history: List[SalaryRevision]

class PulseSurveyTelemetry(BaseModel):
    pulse_provider: str
    current_score: float
    previous_score: float
    sentiment_status: str

class SystemIntegration(BaseModel):
    name: str
    category: str
    status: str
    latency_ms: int

class EmployeeTelemetryResponse(BaseModel):
    employee_id: str
    name: str
    role: str
    department: str
    timesheet: SSOTimesheet
    compensation: CompensationTelemetry
    pulse: PulseSurveyTelemetry
    integrations: List[SystemIntegration]
