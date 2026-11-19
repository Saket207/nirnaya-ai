import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  Briefcase,
  Layers,
  HeartHandshake,
  CheckCircle,
  FileText,
  RefreshCw,
  Send,
  Building,
  User,
  ExternalLink,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Server,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { api } from '../api/api';
import RiskBadge from '../components/RiskBadge';
import RiskGauge from '../components/RiskGauge';
import { DetailSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../context/ToastContext';

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [employee, setEmployee] = useState(null);
  const [mitigation, setMitigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatingRisk, setCalculatingRisk] = useState(false);
  const [mitigationLoading, setMitigationLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mitigation custom context state
  const [mitigationContext, setMitigationContext] = useState('');

  // Enterprise Live Telemetry state
  const [telemetry, setTelemetry] = useState(null);
  const [telemetryOpen, setTelemetryOpen] = useState(false);
  const [telemetryLoading, setTelemetryLoading] = useState(false);

  const handleOpenTelemetry = async () => {
    setTelemetryOpen(true);
    if (!telemetry) {
      setTelemetryLoading(true);
      try {
        const data = await api.getEmployeeTelemetry(id);
        setTelemetry(data);
      } catch (err) {
        console.error('Failed to fetch telemetry:', err);
        toast.error('Failed to retrieve live enterprise telemetry.');
      } finally {
        setTelemetryLoading(false);
      }
    }
  };

  const loadEmployeeData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch employee details
      const empData = await api.getEmployeeById(id);
      setEmployee(empData);

      // 2. Fetch mitigation recommendation
      loadMitigation(id);
    } catch (err) {
      console.error('Error fetching employee details:', err);
      setError(err.message || 'Failed to retrieve employee record.');
    } finally {
      setLoading(false);
    }
  };

  const loadMitigation = async (empId, context = '') => {
    setMitigationLoading(true);
    try {
      const mitData = await api.getMitigation(empId, context);
      setMitigation(mitData);
    } catch (err) {
      console.error('Error fetching mitigation:', err);
    } finally {
      setMitigationLoading(false);
    }
  };

  // Re-run XGBoost model & SHAP explainability live via GET /risk/{id}
  const handleRecalculateRisk = async () => {
    setCalculatingRisk(true);
    try {
      const updated = await api.getEmployeeRisk(id);
      setEmployee(updated);
      toast.success('Live XGBoost model and SHAP factors updated successfully!');
      // Refresh mitigation recommendations as well
      loadMitigation(id);
    } catch (err) {
      toast.error('Failed to recalculate risk: ' + (err.message || 'Model error'));
    } finally {
      setCalculatingRisk(false);
    }
  };

  const handleCustomMitigationSubmit = (e) => {
    e.preventDefault();
    if (!mitigationContext.trim()) return;
    loadMitigation(id, mitigationContext.trim());
    toast.info('Generating tailored mitigation plan with added HR context...');
  };

  useEffect(() => {
    if (id) {
      loadEmployeeData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <ErrorMessage
          title="Employee Not Found"
          message={error || `Could not find an employee with ID: ${id}`}
          onRetry={loadEmployeeData}
        />
      </div>
    );
  }

  const reasonsList = employee.reasons || [];
  const protectiveList = employee.protectiveFactors || [];

  return (
    <div className="space-y-6">
      {/* Back button and Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A736E] hover:text-[#312C29] transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Risk Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Small button to show Enterprise Telemetry & Compensation */}
          <button
            onClick={handleOpenTelemetry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#312C29] hover:bg-[#1C1816] text-[#FBF4EF] font-semibold text-xs transition-all active:scale-95 shadow-xs"
            title="View Live SSO Timesheet, Monthly Hours, Salary History & API Integrations"
          >
            <Activity className="w-3.5 h-3.5 text-[#D9684C]" />
            <span>Enterprise Telemetry & Comp</span>
          </button>

          <button
            onClick={handleRecalculateRisk}
            disabled={calculatingRisk}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FDEAE5] hover:bg-[#F5E9DF] text-[#B2553E] font-semibold text-xs border border-[#D9684C]/30 transition-all active:scale-95 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${calculatingRisk ? 'animate-spin' : ''}`} />
            <span>{calculatingRisk ? 'Running SHAP Explainer...' : 'Re-calculate Risk & SHAP'}</span>
          </button>
        </div>
      </div>

      {/* Employee Identity Header Card */}
      <div className="bg-white rounded-2xl border border-[#DED1C9] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold text-2xl flex items-center justify-center shadow-md shadow-[#312C29]/15 flex-shrink-0">
            {employee.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-bold tracking-tight text-[#312C29]">{employee.name}</h1>
              <RiskBadge score={employee.riskScore} level={employee.riskLevel} showScore={true} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#7A736E]">
              <span className="flex items-center gap-1 font-medium text-[#312C29]">
                <Briefcase className="w-3.5 h-3.5 text-[#7A736E]" />
                {employee.role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#7A736E]" />
                {employee.department}
              </span>
              <span>•</span>
              <span className="font-mono text-[#7A736E]">ID: {employee.id}</span>
            </div>
          </div>
        </div>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 max-w-sm">
          {employee.skills && employee.skills.length > 0 ? (
            employee.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#7A736E] italic">No skills catalogued</span>
          )}
        </div>
      </div>

      {/* ── Risk Reasoning Panel: XGBoost + SHAP Explainability (THE CORE AI WORKFLOW) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Gauge & Model Output */}
        <div className="space-y-6">
          <RiskGauge score={employee.riskScore} level={employee.riskLevel} />

          {/* Model Summary Statement */}
          <div className="bg-[#312C29] text-[#FBF4EF] rounded-2xl p-5 shadow-xs border border-[#1C1816]">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold font-heading text-[#D9684C]">
              <Sparkles className="w-4 h-4 text-[#D9684C]" />
              <span>AI Executive Summary</span>
            </div>
            <p className="text-xs leading-relaxed text-[#FBF4EF]/90">
              {employee.summary || 'Summary reasoning is generated by synthesizing SHAP feature values.'}
            </p>
          </div>

          {/* Key Workforce Metrics Grid */}
          <div className="bg-white rounded-2xl border border-[#DED1C9] p-5 shadow-xs space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
              Workforce Attributes
            </h4>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Company Tenure</span>
                <span className="text-base font-bold text-[#312C29] font-mono">
                  {employee.tenure_months || 0} mos
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Engagement Score</span>
                <span className={`text-base font-bold font-mono ${
                  (employee.engagement_score || 0) <= 1.5
                    ? 'text-[#C62828]'
                    : (employee.engagement_score || 0) <= 2.5
                    ? 'text-[#B2553E]'
                    : 'text-[#2E7D32]'
                }`}>
                  {employee.engagement_score !== undefined ? `${employee.engagement_score}/4` : '—'}
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Time Since Promotion</span>
                <span className="text-base font-bold text-[#312C29] font-mono">
                  {employee.time_since_promotion_months || 0} mos
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Overtime Burden</span>
                <span className="text-base font-bold text-[#312C29] font-mono">
                  {(employee.overtime_hours || 0)} hrs/wk
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Job Level</span>
                <span className="text-base font-bold text-[#312C29] font-mono">
                  Level {employee.JobLevel || 1}
                </span>
              </div>

              <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]/70">
                <span className="text-[10px] text-[#7A736E] block font-medium">Work-Life Balance</span>
                <span className="text-base font-bold text-[#312C29] font-mono">
                  {employee.WorkLifeBalance || 3}/4
                </span>
              </div>
            </div>

            {/* Quick Trigger for Enterprise Telemetry */}
            <button
              onClick={handleOpenTelemetry}
              className="w-full mt-2 pt-2.5 border-t border-[#DED1C9] flex items-center justify-between text-[11px] font-semibold text-[#D9684C] hover:text-[#B2553E] transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#2E7D32]" />
                Live Attendance & Compensation Stream
              </span>
              <span>Inspect →</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: SHAP Explanations & Policy Mitigation */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHAP Factor Breakdown: Why at risk vs Protective factors */}
          <div className="bg-white rounded-2xl border border-[#DED1C9] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-[#312C29]">SHAP Explainability Breakdown</h3>
                <p className="text-xs text-[#7A736E]">
                  Mathematical attribution showing which signals increase or decrease attrition probability
                </p>
              </div>
              <span className="text-[10px] font-bold bg-[#F5E9DF] text-[#312C29] px-2.5 py-1 rounded-md border border-[#DED1C9]">
                SHAP TreeExplainer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Drivers (Why at risk) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C62828] uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#C62828]" />
                  <span>Why this person is at risk ({reasonsList.length})</span>
                </div>

                {reasonsList.length > 0 ? (
                  <div className="space-y-2">
                    {reasonsList.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#FFEBEE] border border-[#EF9A9A]/70 text-xs text-[#C62828] font-medium leading-relaxed flex items-start gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-[#C62828] mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] text-xs text-[#7A736E] text-center">
                    No primary risk-increasing factors detected by the model.
                  </div>
                )}
              </div>

              {/* Protective Factors (What's protecting them) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>What's protecting them ({protectiveList.length})</span>
                </div>

                {protectiveList.length > 0 ? (
                  <div className="space-y-2">
                    {protectiveList.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#E8F5E9] border border-[#A5D6A7]/70 text-xs text-[#2E7D32] font-medium leading-relaxed flex items-start gap-2.5"
                      >
                        <CheckCircle className="w-4 h-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] text-xs text-[#7A736E] text-center">
                    No significant protective factors detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Policy-Checked Mitigation Recommendation Card ── */}
          <div className="bg-white rounded-2xl border border-[#DED1C9] p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-heading font-bold text-[#312C29] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D9684C]" />
                  <span>Recommended Action Plan</span>
                </h3>
                <p className="text-xs text-[#7A736E]">
                  AI-synthesized intervention tailored to the specific risk drivers and validated against internal policies.
                </p>
              </div>

              {/* Policy Verification Badge */}
              <div>
                {mitigation?.isPolicyVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] ring-1 ring-[#2E7D32]/20">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Policy Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/40 ring-1 ring-[#D9684C]/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D9684C]" />
                    <span>Not policy-verified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Plan Text Box */}
            <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] text-[#312C29] mb-4">
              <p className="text-sm font-semibold leading-relaxed">
                {mitigation?.recommendedAction || employee.recommendedAction || 'Schedule an immediate 1-on-1 career progression review.'}
              </p>

              {/* Policy Reference Citation */}
              {mitigation?.policyReference && (
                <div className="mt-3 pt-3 border-t border-[#DED1C9] flex items-center gap-2 text-xs text-[#312C29]">
                  <FileText className="w-4 h-4 text-[#D9684C] flex-shrink-0" />
                  <span className="font-semibold">Governing Policy:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#DED1C9] text-[11px]">
                    {mitigation.policyReference}
                  </span>
                </div>
              )}
            </div>

            {/* Custom HR Context Formulation Form */}
            <form onSubmit={handleCustomMitigationSubmit} className="mt-4 pt-4 border-t border-[#DED1C9]">
              <label className="text-xs font-semibold text-[#312C29] block mb-1.5">
                Customize Intervention with Additional HR Context:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mitigationContext}
                  onChange={(e) => setMitigationContext(e.target.value)}
                  placeholder="e.g. Employee recently requested remote flexibility or mentoring junior devs..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#DED1C9] bg-[#FAF6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 text-[#312C29]"
                />
                <button
                  type="submit"
                  disabled={mitigationLoading || !mitigationContext.trim()}
                  className="px-4 py-2 rounded-xl bg-[#312C29] hover:bg-[#1C1816] disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{mitigationLoading ? 'Synthesizing...' : 'Re-generate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Enterprise Live Telemetry & Compensation Drawer / Modal ── */}
      {telemetryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#312C29]/60 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200">
          <div className="bg-[#FBF4EF] w-full max-w-2xl min-h-screen shadow-2xl flex flex-col border-l border-[#DED1C9] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#DED1C9] sticky top-0 bg-[#FAF6F2]/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#D9684C] flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-heading font-bold text-[#312C29]">Enterprise Live Telemetry & Comp</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C] animate-pulse"></span>
                      LIVE STREAM
                    </span>
                  </div>
                  <p className="text-xs text-[#7A736E]">
                    Real-time workforce signals for <span className="font-semibold text-[#312C29]">{employee.name}</span> ({employee.role})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTelemetryOpen(false)}
                className="p-2 rounded-xl text-[#7A736E] hover:text-[#312C29] hover:bg-[#F2EAE3] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Architecture & Live API Explanation Banner */}
              <div className="p-4 rounded-2xl bg-[#312C29] text-[#FBF4EF] text-xs space-y-2 border border-[#1C1816]">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#D9684C]" />
                    Real-World Enterprise Integration Gateway
                  </span>
                  <span className="text-[10px] font-mono text-[#D9684C] bg-[#FAF6F2]/10 px-2 py-0.5 rounded border border-[#D9684C]/30">
                    REST API Ready
                  </span>
                </div>
                <p className="text-[#FBF4EF]/85 leading-relaxed text-[11px]">
                  In production, this dashboard streams live telemetry directly from your company's SSO (Okta/Google Identity), Payroll (Workday/ADP), and Developer Activity (Jira/GitHub). The backend route <code className="bg-[#1C1816] text-[#D9684C] px-1 py-0.5 rounded">GET /employees/{'{id}'}/telemetry</code> is architected to seamlessly map to your live third-party API keys.
                </p>
              </div>

              {telemetryLoading ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#D9684C] animate-spin mx-auto" />
                  <p className="text-xs font-medium text-[#7A736E]">Querying Okta SSO & Workday Payroll APIs...</p>
                </div>
              ) : telemetry ? (
                <>
                  {/* Section 1: SSO Attendance & Timesheets */}
                  <div className="bg-white rounded-2xl border border-[#DED1C9] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#DED1C9] pb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#D9684C]" />
                        <h3 className="text-sm font-heading font-bold text-[#312C29]">Daily SSO Attendance & Timesheets</h3>
                      </div>
                      <span className="text-[11px] text-[#7A736E] font-medium">
                        Provider: <span className="font-semibold text-[#312C29]">{telemetry.timesheet.provider}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Today's Check-in</span>
                        <span className="text-sm font-bold text-[#312C29] font-mono mt-0.5 block">
                          {telemetry.timesheet.today_login}
                        </span>
                        <span className="text-[10px] text-[#2E7D32] font-medium">SSO Handshake</span>
                      </div>

                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Projected Check-out</span>
                        <span className="text-sm font-bold text-[#312C29] font-mono mt-0.5 block">
                          {telemetry.timesheet.today_logout}
                        </span>
                        <span className="text-[10px] text-[#7A736E] font-medium">Avg: {telemetry.timesheet.avg_checkout}</span>
                      </div>

                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Days Worked</span>
                        <span className="text-sm font-bold text-[#312C29] font-mono mt-0.5 block">
                          {telemetry.timesheet.days_worked_this_month} / 22 days
                        </span>
                        <span className="text-[10px] text-[#7A736E] font-medium">Active month</span>
                      </div>

                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Schedule Status</span>
                        <span className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${
                          telemetry.timesheet.overtime_hours_this_month > 10
                            ? 'bg-[#FFEBEE] text-[#C62828]'
                            : 'bg-[#E8F5E9] text-[#2E7D32]'
                        }`}>
                          {telemetry.timesheet.work_schedule_status}
                        </span>
                      </div>
                    </div>

                    {/* Monthly Hours Worked Progress Bar */}
                    <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#312C29]">Total Hours Worked This Month:</span>
                        <span className="font-bold font-mono text-[#312C29]">
                          {telemetry.timesheet.total_hours_this_month} hrs <span className="text-[#7A736E] font-normal">/ {telemetry.timesheet.standard_hours_benchmark} hrs baseline</span>
                        </span>
                      </div>
                      
                      <div className="w-full bg-[#DED1C9] h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-[#312C29] h-full"
                          style={{ width: `${Math.min(100, (telemetry.timesheet.standard_hours_benchmark / Math.max(160, telemetry.timesheet.total_hours_this_month)) * 100)}%` }}
                        />
                        {telemetry.timesheet.overtime_hours_this_month > 0 && (
                          <div
                            className="bg-[#D9684C] h-full"
                            style={{ width: `${Math.min(100, (telemetry.timesheet.overtime_hours_this_month / Math.max(160, telemetry.timesheet.total_hours_this_month)) * 100)}%` }}
                            title={`Overtime: ${telemetry.timesheet.overtime_hours_this_month} hrs`}
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-[#7A736E]">
                          Standard: 40 hrs/wk (160h mo)
                        </span>
                        <span className={telemetry.timesheet.overtime_hours_this_month > 0 ? "text-[#C62828] font-bold" : "text-[#2E7D32] font-medium"}>
                          {telemetry.timesheet.overtime_hours_this_month > 0 
                            ? `+${telemetry.timesheet.overtime_hours_this_month} hrs Overtime Burden (${employee.overtime_hours || 0}h/wk)`
                            : 'Zero Overtime Excess'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Compensation & Salary Trajectory */}
                  <div className="bg-white rounded-2xl border border-[#DED1C9] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#DED1C9] pb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#D9684C]" />
                        <h3 className="text-sm font-heading font-bold text-[#312C29]">Compensation & Salary Trajectory</h3>
                      </div>
                      <span className="text-[11px] text-[#7A736E] font-medium">
                        Provider: <span className="font-semibold text-[#312C29]">{telemetry.compensation.payroll_provider}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-[#FAF6F2] p-3.5 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Current Base Salary</span>
                        <span className="text-lg font-bold text-[#312C29] font-mono mt-0.5 block">
                          ${telemetry.compensation.current_salary.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#7A736E]">Annual base compensation</span>
                      </div>

                      <div className="bg-[#FAF6F2] p-3.5 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Previous Salary</span>
                        <span className="text-lg font-bold text-[#5D5753] font-mono mt-0.5 block">
                          ${telemetry.compensation.previous_salary.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-semibold mt-0.5">
                          {telemetry.compensation.salary_delta_percentage > 0 ? (
                            <span className="text-[#2E7D32] flex items-center font-bold">
                              <TrendingUp className="w-3 h-3 mr-0.5" />
                              +{telemetry.compensation.salary_delta_percentage}% hike
                            </span>
                          ) : (
                            <span className="text-[#B2553E] flex items-center font-bold">
                              0.0% (No revision)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FAF6F2] p-3.5 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Compa-Ratio Benchmark</span>
                        <span className="text-lg font-bold text-[#312C29] font-mono mt-0.5 block">
                          {telemetry.compensation.compa_ratio}x
                        </span>
                        <span className={`text-[10px] font-semibold ${telemetry.compensation.is_below_market ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                          {telemetry.compensation.is_below_market ? 'Below Market Band (<0.95)' : 'Aligned with Market Band'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9] gap-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${telemetry.compensation.months_without_salary_revision > 12 ? 'text-[#D9684C]' : 'text-[#7A736E]'}`} />
                        <span className="text-[#312C29]">
                          Months without Salary Revision: <strong className="font-mono text-[#312C29]">{telemetry.compensation.months_without_salary_revision} months</strong>
                        </span>
                      </div>
                      <span className="text-[#7A736E] text-[11px]">
                        Market Median for Level: <strong className="font-mono text-[#312C29]">${telemetry.compensation.market_median_benchmark.toLocaleString()}</strong>
                      </span>
                    </div>

                    {/* Salary Revision Table */}
                    <div>
                      <h4 className="text-xs font-bold text-[#312C29] mb-2 font-heading">Payroll Revision History (Workday)</h4>
                      <div className="overflow-x-auto rounded-xl border border-[#DED1C9]">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-[#FAF6F2] text-[#7A736E] font-semibold border-b border-[#DED1C9]">
                            <tr>
                              <th className="px-3.5 py-2">Effective Date</th>
                              <th className="px-3.5 py-2">Role / Level</th>
                              <th className="px-3.5 py-2">Annual Salary</th>
                              <th className="px-3.5 py-2">Adjustment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#F2EAE3]">
                            {telemetry.compensation.salary_history.map((rev, i) => (
                              <tr key={i} className="hover:bg-[#FAF6F2]/50">
                                <td className="px-3.5 py-2 font-mono text-[#5D5753]">{rev.date}</td>
                                <td className="px-3.5 py-2 font-medium text-[#312C29]">{rev.title}</td>
                                <td className="px-3.5 py-2 font-mono font-bold text-[#312C29]">${rev.salary.toLocaleString()}</td>
                                <td className="px-3.5 py-2">
                                  {rev.hike_percentage > 0 ? (
                                    <span className="inline-flex items-center text-[#2E7D32] font-semibold">
                                      +{rev.hike_percentage}%
                                    </span>
                                  ) : (
                                    <span className="text-[#7A736E]">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Culture Amp & Lattice Pulse */}
                  <div className="bg-white rounded-2xl border border-[#DED1C9] p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#DED1C9] pb-3">
                      <div className="flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-[#D9684C]" />
                        <h3 className="text-sm font-heading font-bold text-[#312C29]">Pulse Survey Sentiment Telemetry</h3>
                      </div>
                      <span className="text-[11px] text-[#7A736E] font-medium">
                        Provider: <span className="font-semibold text-[#312C29]">{telemetry.pulse.pulse_provider}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Latest Pulse Score</span>
                        <span className="text-base font-bold font-mono text-[#312C29] mt-0.5 block">
                          {telemetry.pulse.current_score} / 4.0
                        </span>
                      </div>
                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Previous Month</span>
                        <span className="text-base font-bold font-mono text-[#5D5753] mt-0.5 block">
                          {telemetry.pulse.previous_score} / 4.0
                        </span>
                      </div>
                      <div className="bg-[#FAF6F2] p-3 rounded-xl border border-[#DED1C9]">
                        <span className="text-[10px] text-[#7A736E] font-medium uppercase tracking-wider block">Sentiment Status</span>
                        <span className="text-xs font-bold text-[#312C29] mt-1 block">
                          {telemetry.pulse.sentiment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Live System Connectors */}
                  <div className="bg-white rounded-2xl border border-[#DED1C9] p-5 shadow-xs space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                      Connected Enterprise Identity & Payroll Connectors
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {telemetry.integrations.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F2] border border-[#DED1C9]">
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-[#7A736E]" />
                            <div>
                              <p className="text-xs font-bold text-[#312C29]">{item.name}</p>
                              <p className="text-[10px] text-[#7A736E]">{item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#A5D6A7]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                              {item.status}
                            </span>
                            <p className="text-[9px] font-mono text-[#7A736E] mt-0.5">{item.latency_ms}ms latency</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#DED1C9] bg-[#FAF6F2] flex items-center justify-between">
              <span className="text-xs text-[#7A736E]">
                Data refreshed via Nirnaya Telemetry Gateway
              </span>
              <button
                onClick={() => setTelemetryOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#312C29] hover:bg-[#1C1816] text-white font-semibold text-xs transition-colors"
              >
                Close Telemetry Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailPage;
