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
  ExternalLink
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
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Risk Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculateRisk}
            disabled={calculatingRisk}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100/80 text-brand-700 font-semibold text-xs border border-brand-200 transition-all active:scale-95 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${calculatingRisk ? 'animate-spin' : ''}`} />
            <span>{calculatingRisk ? 'Running SHAP Explainer...' : 'Re-calculate Risk & SHAP'}</span>
          </button>
        </div>
      </div>

      {/* Employee Identity Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-brand-500/20 flex-shrink-0">
            {employee.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{employee.name}</h1>
              <RiskBadge score={employee.riskScore} level={employee.riskLevel} showScore={true} size="md" />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {employee.role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {employee.department}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-400">ID: {employee.id}</span>
            </div>
          </div>
        </div>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 max-w-sm">
          {employee.skills && employee.skills.length > 0 ? (
            employee.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No skills catalogued</span>
          )}
        </div>
      </div>

      {/* ── Risk Reasoning Panel: XGBoost + SHAP Explainability (THE CORE AI WORKFLOW) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Gauge & Model Output */}
        <div className="space-y-6">
          <RiskGauge score={employee.riskScore} level={employee.riskLevel} />

          {/* Model Summary Statement */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-xs border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-brand-300">
              <Sparkles className="w-4 h-4" />
              <span>AI Executive Summary</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              {employee.summary || 'Summary reasoning is generated by synthesizing SHAP feature values.'}
            </p>
          </div>

          {/* Key Workforce Metrics Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Workforce Attributes
            </h4>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Company Tenure</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {employee.tenure_months || 0} mos
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Engagement Score</span>
                <span className={`text-base font-bold font-mono ${
                  (employee.engagement_score || 0) <= 1.5
                    ? 'text-rose-600'
                    : (employee.engagement_score || 0) <= 2.5
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {employee.engagement_score !== undefined ? `${employee.engagement_score}/4` : '—'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Time Since Promotion</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {employee.time_since_promotion_months || 0} mos
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Overtime Burden</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {(employee.overtime_hours || 0)} hrs/wk
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Job Level</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  Level {employee.JobLevel || 1}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Work-Life Balance</span>
                <span className="text-base font-bold text-slate-800 font-mono">
                  {employee.WorkLifeBalance || 3}/4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: SHAP Explanations & Policy Mitigation */}
        <div className="lg:col-span-2 space-y-6">
          {/* SHAP Factor Breakdown: Why at risk vs Protective factors */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">SHAP Explainability Breakdown</h3>
                <p className="text-xs text-slate-500">
                  Mathematical attribution showing which signals increase or decrease attrition probability
                </p>
              </div>
              <span className="text-[11px] font-semibold bg-indigo-50 text-brand-700 px-2 py-1 rounded-md border border-brand-200">
                SHAP TreeExplainer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risk Drivers (Why at risk) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Why this person is at risk ({reasonsList.length})</span>
                </div>

                {reasonsList.length > 0 ? (
                  <div className="space-y-2">
                    {reasonsList.map((reason, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 font-medium leading-relaxed flex items-start gap-2.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                    No primary risk-increasing factors detected by the model.
                  </div>
                )}
              </div>

              {/* Protective Factors (What's protecting them) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>What's protecting them ({protectiveList.length})</span>
                </div>

                {protectiveList.length > 0 ? (
                  <div className="space-y-2">
                    {protectiveList.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 font-medium leading-relaxed flex items-start gap-2.5"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                    No significant protective factors detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Policy-Checked Mitigation Recommendation Card ── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  <span>Recommended Action Plan</span>
                </h3>
                <p className="text-xs text-slate-500">
                  AI-synthesized intervention tailored to the specific risk drivers and validated against internal policies.
                </p>
              </div>

              {/* Policy Verification Badge */}
              <div>
                {mitigation?.isPolicyVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Policy Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Not policy-verified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Plan Text Box */}
            <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 text-slate-800 mb-4">
              <p className="text-sm font-semibold leading-relaxed">
                {mitigation?.recommendedAction || employee.recommendedAction || 'Schedule an immediate 1-on-1 career progression review.'}
              </p>

              {/* Policy Reference Citation */}
              {mitigation?.policyReference && (
                <div className="mt-3 pt-3 border-t border-brand-200/60 flex items-center gap-2 text-xs text-brand-800">
                  <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="font-semibold">Governing Policy:</span>
                  <span className="font-mono bg-white/70 px-2 py-0.5 rounded border border-brand-200 text-[11px]">
                    {mitigation.policyReference}
                  </span>
                </div>
              )}
            </div>

            {/* Custom HR Context Formulation Form */}
            <form onSubmit={handleCustomMitigationSubmit} className="mt-4 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Customize Intervention with Additional HR Context:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mitigationContext}
                  onChange={(e) => setMitigationContext(e.target.value)}
                  placeholder="e.g. Employee recently requested remote flexibility or mentoring junior devs..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  disabled={mitigationLoading || !mitigationContext.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{mitigationLoading ? 'Synthesizing...' : 'Re-generate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
