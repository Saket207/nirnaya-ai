import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users2,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
  Clock,
  HeartHandshake,
  Compass,
  Briefcase,
  Zap,
  Activity,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { api } from '../api/api';
import RiskBadge from '../components/RiskBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const DEPARTMENTS_INFO = [
  {
    name: 'Engineering',
    tagline: 'Core Software Architecture, Cloud Infrastructure & Reliability',
    lead: 'Rohan Gupta',
    sla: '99.95% Availability',
    icon: '💻'
  },
  {
    name: 'Data & AI',
    tagline: 'Applied Machine Learning, Vector RAG Systems & Analytics Pipelines',
    lead: 'Arjun Sundaram',
    sla: 'Sub-100ms Inference',
    icon: '🧠'
  },
  {
    name: 'Product',
    tagline: 'Strategic Product Vision, User Research & Enterprise Roadmaps',
    lead: 'Siddharth Rao',
    sla: 'Bi-Weekly Releases',
    icon: '🚀'
  },
  {
    name: 'Design & UX',
    tagline: 'Design Tokens, User Testing & Enterprise Design Systems',
    lead: 'Meera Joshi',
    sla: '100% WCAG a11y',
    icon: '🎨'
  },
  {
    name: 'Cybersecurity & IT',
    tagline: 'Zero-Trust Architecture, SOC2 Compliance & Threat Monitoring',
    lead: 'Karthik Venkatesh',
    sla: '<15m Incident SLA',
    icon: '🛡️'
  },
  {
    name: 'Customer Success',
    tagline: 'Enterprise Client Retention, Tier-1 Escalations & NPS Advocacy',
    lead: 'Manish Tiwari',
    sla: '98.5% Client CSAT',
    icon: '🤝'
  },
  {
    name: 'Sales',
    tagline: 'B2B Enterprise Revenue, Pipeline Expansion & Key Accounts',
    lead: 'Karan Malhotra',
    sla: '125% ARR Target',
    icon: '📈'
  },
  {
    name: 'Marketing',
    tagline: 'Performance Growth, Global Brand Strategy & Lead Generation',
    lead: 'Diya Sen',
    sla: '3.5x Pipeline ROI',
    icon: '📣'
  },
  {
    name: 'Finance & Operations',
    tagline: 'Fiscal Forecasting, Procurement Governance & Cost Optimization',
    lead: 'Rajesh Nambiar',
    sla: 'Zero Audit Variance',
    icon: '📊'
  },
  {
    name: 'Human Resources',
    tagline: 'Talent Acquisition, People Operations & Retention Governance',
    lead: 'Kavita Deshmukh',
    sla: '<30d Time-to-Hire',
    icon: '👥'
  }
];

const TeamViewPage = () => {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('Engineering');
  const [summaryData, setSummaryData] = useState(null);
  const [teamEmployees, setTeamEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeamData = async (dept) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch team risk rollup summary from backend
      const summary = await api.getTeamRiskSummary(dept);
      setSummaryData(summary);

      // 2. Fetch all employees in this department for drill-down roster
      const emps = await api.getEmployees(dept);
      setTeamEmployees(emps);
    } catch (err) {
      console.error('Error fetching team summary:', err);
      setError(err.message || `Failed to fetch data for ${dept}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData(selectedDept);
  }, [selectedDept]);

  // Current department metadata
  const deptMeta = DEPARTMENTS_INFO.find((d) => d.name === selectedDept) || {
    name: selectedDept,
    tagline: 'Workforce Department Operations',
    lead: 'Department Head',
    sla: 'Operational Target',
    icon: '🏢'
  };

  // Compute Elaborated Analytics Metrics
  const avgOvertime = teamEmployees.length
    ? (teamEmployees.reduce((acc, e) => acc + (e.overtime_hours || 0), 0) / teamEmployees.length).toFixed(1)
    : '0.0';

  const avgEngagement = teamEmployees.length
    ? (teamEmployees.reduce((acc, e) => acc + (e.engagement_score || 3.0), 0) / teamEmployees.length).toFixed(2)
    : '3.0';

  const avgPromoLag = teamEmployees.length
    ? Math.round(teamEmployees.reduce((acc, e) => acc + (e.time_since_promotion_months || 0), 0) / teamEmployees.length)
    : 0;

  // Department Health Status Assessment
  const atRiskRatio = summaryData && summaryData.total_employees > 0
    ? (summaryData.at_risk_count / summaryData.total_employees)
    : 0;

  const healthStatus = atRiskRatio >= 0.5
    ? { label: 'Critical Attention', color: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20', dot: 'bg-rose-500' }
    : atRiskRatio >= 0.25
    ? { label: 'Elevated Watch', color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20', dot: 'bg-amber-500' }
    : { label: 'Healthy Operations', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20', dot: 'bg-emerald-500' };

  // Prepare chart data for Recharts
  const chartData = summaryData
    ? [
        { name: 'Low Risk (<40%)', count: summaryData.low_risk_count, color: '#2E7D32' },
        { name: 'Medium Risk (40-69%)', count: summaryData.medium_risk_count, color: '#D9684C' },
        { name: 'High Risk (≥70%)', count: summaryData.high_risk_count, color: '#C62828' },
      ]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Context ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-[#312C29] flex items-center gap-2.5">
            <span>Enterprise Department Risk Intelligence</span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/30 uppercase tracking-wider">
              10 Departments Monitored
            </span>
          </h1>
          <p className="text-xs text-[#7A736E] mt-0.5 max-w-2xl">
            Aggregate workforce telemetry combining XGBoost individual attrition probabilities, SHAP common root-cause factors, and systemic burnout signals.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ring-1 ${healthStatus.color}`}>
            <span className={`w-2 h-2 rounded-full ${healthStatus.dot} animate-pulse`} />
            <span>{selectedDept}: {healthStatus.label}</span>
          </span>
        </div>
      </div>

      {/* ── Department Selector Tabs (10 Departments) ── */}
      <div className="bg-white rounded-2xl border border-[#DED1C9] p-2 shadow-xs overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {DEPARTMENTS_INFO.map((dept) => {
            const isSelected = selectedDept === dept.name;
            return (
              <button
                key={dept.name}
                onClick={() => setSelectedDept(dept.name)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#312C29] text-white shadow-xs'
                    : 'text-[#5D5753] hover:text-[#312C29] hover:bg-[#F2EAE3]'
                }`}
              >
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <ErrorMessage
          title={`No Records Found for ${selectedDept}`}
          message={error}
          onRetry={() => fetchTeamData(selectedDept)}
        />
      ) : !summaryData ? (
        <div className="bg-white rounded-2xl border border-[#DED1C9] p-12 text-center shadow-xs">
          <h3 className="text-base font-heading font-bold text-[#312C29]">No data found</h3>
        </div>
      ) : (
        <>
          {/* ── Elaborated Department Overview Banner ── */}
          <div className="bg-[#312C29] text-[#FBF4EF] p-6 sm:p-7 rounded-3xl shadow-sm border border-[#1C1816] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold font-heading text-[#D9684C]">
                  <Sparkles className="w-4 h-4 text-[#D9684C]" />
                  <span>{deptMeta.icon} {deptMeta.name} Organizational Charter</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-white">
                  {deptMeta.tagline}
                </h2>
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#FBF4EF]/80">
                  <span>Department Lead: <strong className="text-white">{deptMeta.lead}</strong></span>
                  <span>•</span>
                  <span>Operational SLA: <strong className="text-[#D9684C]">{deptMeta.sla}</strong></span>
                  <span>•</span>
                  <span>Total Headcount: <strong className="text-white font-mono">{summaryData.total_employees} members</strong></span>
                </div>
              </div>

              {/* Natural Language Summary Statement */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 max-w-md text-xs leading-relaxed text-[#FBF4EF]/90">
                <span className="font-bold text-white block mb-1">Executive AI Rollup:</span>
                {summaryData.summary}
              </div>
            </div>
          </div>

          {/* ── 5 Detailed Health & Telemetry Metrics ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4.5 rounded-2xl border border-[#DED1C9] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">Total Roster</span>
              <div className="text-2xl font-extrabold text-[#312C29] font-mono mt-0.5">
                {summaryData.total_employees}
              </div>
              <span className="text-[11px] text-[#7A736E]">active employees</span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#EF9A9A]/70 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828] block">At-Risk Count</span>
              <div className="text-2xl font-extrabold text-[#C62828] font-mono mt-0.5">
                {summaryData.at_risk_count}
              </div>
              <span className="text-[11px] text-[#C62828] font-medium">{summaryData.high_risk_count} High, {summaryData.medium_risk_count} Medium</span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#DED1C9] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">Burnout Index (Avg OT)</span>
              <div className="text-2xl font-extrabold text-[#312C29] font-mono mt-0.5">
                {avgOvertime} <span className="text-xs text-[#7A736E] font-normal">hrs/wk</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">team average overtime</span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#DED1C9] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">Avg Engagement</span>
              <div className={`text-2xl font-extrabold font-mono mt-0.5 ${
                parseFloat(avgEngagement) <= 2.0 ? 'text-[#C62828]' : parseFloat(avgEngagement) <= 3.0 ? 'text-[#B2553E]' : 'text-[#2E7D32]'
              }`}>
                {avgEngagement} <span className="text-xs text-[#7A736E] font-normal">/ 4.0</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">satisfaction score</span>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#DED1C9] shadow-xs col-span-2 lg:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">Avg Promotion Lag</span>
              <div className="text-2xl font-extrabold text-[#312C29] font-mono mt-0.5">
                {avgPromoLag} <span className="text-xs text-[#7A736E] font-normal">months</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">since last promotion</span>
            </div>
          </div>

          {/* ── Charts & Common Risk Drivers (Elaborated) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Breakdown Bar Chart */}
            <div className="bg-white rounded-3xl border border-[#DED1C9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#312C29]">Risk Severity Spectrum</h3>
                    <p className="text-xs text-[#7A736E]">Member distribution across XGBoost probability tiers</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-[#7A736E]" />
                </div>

                <div className="h-60 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7A736E' }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#7A736E' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(val) => [`${val} Team Members`, 'Count']}
                        contentStyle={{ backgroundColor: '#FAF6F2', borderRadius: '14px', border: '1px solid #DED1C9', boxShadow: '0 4px 12px rgba(49, 44, 41, 0.08)', color: '#312C29' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={44}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DED1C9] flex items-center justify-between text-xs text-[#7A736E]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32]" /> Stable: {summaryData.low_risk_count}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D9684C]" /> Watch: {summaryData.medium_risk_count}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C62828]" /> Critical: {summaryData.high_risk_count}
                </span>
              </div>
            </div>

            {/* Top Common Risk Drivers (Elaborated) */}
            <div className="bg-white rounded-3xl border border-[#DED1C9] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#312C29]">Ranked Systemic Risk Drivers</h3>
                    <p className="text-xs text-[#7A736E]">Common attributions identified by SHAP across {selectedDept}</p>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-[#D9684C]" />
                </div>

                {summaryData.common_risk_factors && summaryData.common_risk_factors.length > 0 ? (
                  <div className="space-y-3">
                    {summaryData.common_risk_factors.map((item, idx) => {
                      const impactPercent = Math.round((item.count / summaryData.total_employees) * 100);
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#FAF6F2] border border-[#DED1C9] space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#DED1C9] text-[#312C29] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                                {idx + 1}
                              </span>
                              <span className="text-xs text-[#312C29] font-semibold leading-relaxed">
                                {item.factor}
                              </span>
                            </div>
                            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] flex-shrink-0">
                              {item.count} affected ({impactPercent}%)
                            </span>
                          </div>

                          {/* Progress indicator */}
                          <div className="w-full bg-[#DED1C9] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#C62828] h-full rounded-full transition-all"
                              style={{ width: `${impactPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-[#7A736E] bg-[#FAF6F2] rounded-2xl">
                    No active systemic risk drivers detected for {selectedDept}.
                  </div>
                )}
              </div>

              {/* Department Governance Advice */}
              <div className="mt-4 pt-4 border-t border-[#DED1C9] flex items-center gap-2 text-xs text-[#7A736E]">
                <FileText className="w-4 h-4 text-[#D9684C] flex-shrink-0" />
                <span>
                  Governed under Acme Retention Standard (POL-HR-COC-2026-V4) & Hybrid Policy (POL-OPS-002).
                </span>
              </div>
            </div>
          </div>

          {/* ── Drill-Down Department Roster ── */}
          <div className="bg-white rounded-3xl border border-[#DED1C9] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#DED1C9] flex items-center justify-between">
              <div>
                <h3 className="text-base font-heading font-bold text-[#312C29]">{selectedDept} Department Team Roster</h3>
                <p className="text-xs text-[#7A736E]">Examine individual employee parameters, overtime burdens, and SHAP explainability</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]">
                {teamEmployees.length} members
              </span>
            </div>

            <div className="divide-y divide-[#F2EAE3]">
              {teamEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="p-4 sm:p-5 hover:bg-[#FBF4EF] cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0 group-hover:bg-[#D9684C] transition-colors">
                      {emp.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#312C29] text-sm group-hover:text-[#D9684C] transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-xs text-[#7A736E]">{emp.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-[#7A736E]">Tenure</div>
                      <div className="text-xs font-bold font-mono text-[#312C29]">{emp.tenure_months} mos</div>
                    </div>

                    <div className="text-right hidden md:block">
                      <div className="text-[11px] text-[#7A736E]">Overtime</div>
                      <div className={`text-xs font-bold font-mono ${emp.overtime_hours > 10 ? 'text-[#C62828]' : 'text-[#312C29]'}`}>
                        {emp.overtime_hours} hrs/wk
                      </div>
                    </div>

                    <div className="text-right hidden md:block">
                      <div className="text-[11px] text-[#7A736E]">Engagement</div>
                      <div className="text-xs font-bold font-mono text-[#312C29]">{emp.engagement_score}/4</div>
                    </div>

                    <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} size="sm" />

                    <ChevronRight className="w-4 h-4 text-[#7A736E] group-hover:text-[#D9684C] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeamViewPage;
