import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  Clock,
  HeartHandshake,
  Compass,
  Briefcase,
  Zap,
  Activity,
  FileText,
  LayoutGrid,
  List,
  Target,
  Award
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

// High-resolution photography assets for editorial department charters
const DEPT_ASSETS = {
  Engineering: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c7c42ec1a182b8ddb_two-colleagues-reviewing-a-tablet-by-a-large-windo.webp',
  'Data & AI': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3deb309b2314ae7589e_man-presenting-to-colleagues-in-a-bright-meeting-r.webp',
  Product: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c46a038c5276c46c28d8_three-colleagues-gathered-around-a-table-writing-n.webp',
  'Design & UX': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c59f40751e40a0ac3_smiling-professional-holding-a-folder-at-his-desk-.webp',
  'Cybersecurity & IT': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c444ebf366815a0e72c2_image-beeipbc4gh.webp',
  'Customer Success': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c445a138eb77fd4be165_image-vz86l8e6yb.webp',
  Sales: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c4440708bd3746e51c18_image-vnk3ehgfnf.webp',
  Marketing: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c445336a25d5ef163f74_image-6pjrjfv3d4.webp',
  'Finance & Operations': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd1808a1d01d0fe115_black-and-white-portrait-of-a-young-man.webp',
  'Human Resources': 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd8b371d14f8868b08_black-and-white-portrait-of-a-woman-with-wind-blow.webp'
};

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
  const [rosterViewMode, setRosterViewMode] = useState('list'); // 'list' | 'grid'

  const deptTabsRef = useRef(null);

  const fetchTeamData = async (dept) => {
    setLoading(true);
    setError(null);
    try {
      const summary = await api.getTeamRiskSummary(dept);
      setSummaryData(summary);

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

  const scrollDeptTabs = (direction) => {
    if (deptTabsRef.current) {
      const amount = direction === 'left' ? -260 : 260;
      deptTabsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Current department metadata
  const deptMeta = DEPARTMENTS_INFO.find((d) => d.name === selectedDept) || {
    name: selectedDept,
    tagline: 'Workforce Department Operations',
    lead: 'Department Head',
    sla: 'Operational Target',
    icon: '🏢'
  };

  const deptHeroImg = DEPT_ASSETS[selectedDept] || DEPT_ASSETS.Engineering;

  // Compute Elaborated Analytics Metrics
  const avgOvertime = teamEmployees.length
    ? (
        teamEmployees.reduce((acc, e) => acc + (e.overtime_hours || 0), 0) /
        teamEmployees.length
      ).toFixed(1)
    : '0.0';

  const avgEngagement = teamEmployees.length
    ? (
        teamEmployees.reduce((acc, e) => acc + (e.engagement_score || 3.0), 0) /
        teamEmployees.length
      ).toFixed(2)
    : '3.0';

  const avgPromoLag = teamEmployees.length
    ? Math.round(
        teamEmployees.reduce(
          (acc, e) => acc + (e.time_since_promotion_months || 0),
          0
        ) / teamEmployees.length
      )
    : 0;

  // Department Health Status Assessment
  const atRiskRatio =
    summaryData && summaryData.total_employees > 0
      ? summaryData.at_risk_count / summaryData.total_employees
      : 0;

  const healthStatus =
    atRiskRatio >= 0.5
      ? {
          label: 'Critical Attention',
          color: 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
          dot: 'bg-[#C62828]'
        }
      : atRiskRatio >= 0.25
      ? {
          label: 'Elevated Watch',
          color: 'bg-[#FDEAE5] text-[#B2553E] border-[#D9684C]/40',
          dot: 'bg-[#D9684C]'
        }
      : {
          label: 'Healthy Operations',
          color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]',
          dot: 'bg-[#2E7D32]'
        };

  // Prepare chart data for Recharts
  const chartData = summaryData
    ? [
        {
          name: 'Low Risk (<40%)',
          count: summaryData.low_risk_count,
          color: '#2E7D32'
        },
        {
          name: 'Medium Risk (40-69%)',
          count: summaryData.medium_risk_count,
          color: '#D9684C'
        },
        {
          name: 'High Risk (≥70%)',
          count: summaryData.high_risk_count,
          color: '#C62828'
        }
      ]
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Page Header & Live Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#D9684C] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9684C]">
              Enterprise Department Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#312C29]">
            Team Rollup & Systemic Health
          </h1>
          <p className="text-xs text-[#7A736E] mt-0.5 max-w-2xl">
            Aggregate workforce telemetry combining calibrated XGBoost individual flight probabilities, TreeSHAP common root-cause attributions, and policy guardrails across 10 functional business units.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-2xs ${healthStatus.color}`}
          >
            <span className={`w-2 h-2 rounded-full ${healthStatus.dot} animate-pulse`} />
            <span>{selectedDept}: {healthStatus.label}</span>
          </span>
        </div>
      </div>

      {/* ── 2. Horizontal Department Selector Track (10 Departments with Smooth Scrolling) ── */}
      <div className="relative bg-white rounded-3xl border border-[#DED1C9] p-2 shadow-xs flex items-center gap-2">
        <button
          onClick={() => scrollDeptTabs('left')}
          className="w-8 h-8 rounded-full border border-[#DED1C9] bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={deptTabsRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DEPARTMENTS_INFO.map((dept) => {
            const isSelected = selectedDept === dept.name;
            return (
              <button
                key={dept.name}
                onClick={() => setSelectedDept(dept.name)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#312C29] text-white shadow-xs'
                    : 'bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] hover:text-[#312C29] border border-[#DED1C9]'
                }`}
              >
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollDeptTabs('right')}
          className="w-8 h-8 rounded-full border border-[#DED1C9] bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
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
        <div className="bg-white rounded-3xl border border-[#DED1C9] p-12 text-center shadow-xs">
          <h3 className="text-base font-heading font-bold text-[#312C29]">No data found</h3>
        </div>
      ) : (
        <>
          {/* ── 3. High-Resolution Editorial Department Showcase Banner ── */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#312C29] bg-[#221D1A] text-white">
            {/* Background contextual photograph with dark contrast gradient */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                src={deptHeroImg}
                alt={deptMeta.name}
                className="w-full h-full object-cover filter grayscale contrast-125"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#221D1A] via-[#221D1A]/90 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-[2px] bg-[#D9684C]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9684C]">
                    {deptMeta.icon} {deptMeta.name} Organizational Charter
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-white leading-tight">
                  {deptMeta.tagline}
                </h2>

                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D9684C]">Lead:</span>
                    <strong className="text-white font-semibold">{deptMeta.lead}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D9684C]">Target SLA:</span>
                    <strong className="text-white font-mono">{deptMeta.sla}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#D9684C]">Monitored Headcount:</span>
                    <strong className="text-white font-mono">{summaryData.total_employees} members</strong>
                  </span>
                </div>
              </div>

              {/* Natural Language Executive AI Rollup Box */}
              <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 max-w-md text-xs leading-relaxed text-white/95 shadow-xl flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#D9684C]" />
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                    Executive AI Synthesis
                  </span>
                </div>
                <p className="text-white/90 leading-relaxed font-sans">
                  {summaryData.summary}
                </p>
              </div>
            </div>
          </div>

          {/* ── 4. 5 Telemetry Health & Burnout Metric Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#DED1C9] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">
                Total Roster
              </span>
              <div className="text-2xl font-heading font-extrabold text-[#312C29] font-mono mt-1">
                {summaryData.total_employees}
              </div>
              <span className="text-[11px] text-[#7A736E]">Active monitored staff</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#EF9A9A]/70 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828] block">
                At-Risk Cohort
              </span>
              <div className="text-2xl font-heading font-extrabold text-[#C62828] font-mono mt-1">
                {summaryData.at_risk_count}
              </div>
              <span className="text-[11px] text-[#C62828] font-medium">
                {summaryData.high_risk_count} High • {summaryData.medium_risk_count} Medium
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#DED1C9] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">
                Burnout Index (Avg OT)
              </span>
              <div className="text-2xl font-heading font-extrabold text-[#312C29] font-mono mt-1">
                {avgOvertime} <span className="text-xs text-[#7A736E] font-normal">hrs/wk</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">Overtime above 40h standard</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#DED1C9] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">
                Avg Engagement
              </span>
              <div
                className={`text-2xl font-heading font-extrabold font-mono mt-1 ${
                  parseFloat(avgEngagement) <= 2.0
                    ? 'text-[#C62828]'
                    : parseFloat(avgEngagement) <= 3.0
                    ? 'text-[#B2553E]'
                    : 'text-[#2E7D32]'
                }`}
              >
                {avgEngagement} <span className="text-xs text-[#7A736E] font-normal">/ 4.0</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">Quarterly pulse score</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#DED1C9] shadow-xs col-span-2 lg:col-span-1 hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">
                Promotion Stagnation
              </span>
              <div className="text-2xl font-heading font-extrabold text-[#312C29] font-mono mt-1">
                {avgPromoLag} <span className="text-xs text-[#7A736E] font-normal">months</span>
              </div>
              <span className="text-[11px] text-[#7A736E]">Since last level change</span>
            </div>
          </div>

          {/* ── 5. Charts & Common Root-Cause Factor Matrix ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Severity Spectrum Bar Chart */}
            <div className="bg-white rounded-3xl border border-[#DED1C9] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#312C29]">
                      Risk Severity Spectrum
                    </h3>
                    <p className="text-xs text-[#7A736E]">
                      Personnel distribution across XGBoost probability tiers for {selectedDept}
                    </p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-[#7A736E]" />
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#7A736E' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#7A736E' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(val) => [`${val} Team Members`, 'Headcount']}
                        contentStyle={{
                          backgroundColor: '#FAF6F2',
                          borderRadius: '16px',
                          border: '1px solid #DED1C9',
                          boxShadow: '0 8px 24px rgba(49, 44, 41, 0.08)',
                          color: '#312C29'
                        }}
                      />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={48}>
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
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                  <span>Stable: <strong>{summaryData.low_risk_count}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9684C]" />
                  <span>Watch: <strong>{summaryData.medium_risk_count}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
                  <span>Critical: <strong>{summaryData.high_risk_count}</strong></span>
                </span>
              </div>
            </div>

            {/* Ranked Systemic Risk Drivers */}
            <div className="bg-white rounded-3xl border border-[#DED1C9] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-[#312C29]">
                      Ranked Systemic Risk Drivers
                    </h3>
                    <p className="text-xs text-[#7A736E]">
                      SHAP attributions identified across {selectedDept} personnel
                    </p>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-[#D9684C]" />
                </div>

                {summaryData.common_risk_factors && summaryData.common_risk_factors.length > 0 ? (
                  <div className="space-y-3">
                    {summaryData.common_risk_factors.map((item, idx) => {
                      const impactPercent = Math.round(
                        (item.count / summaryData.total_employees) * 100
                      );
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#DED1C9] space-y-2 hover:border-[#D9684C]/40 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#312C29] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 font-mono">
                                {idx + 1}
                              </span>
                              <span className="text-xs text-[#312C29] font-bold leading-relaxed">
                                {item.factor}
                              </span>
                            </div>
                            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#FFEBEE] text-[#C62828] border border-[#EF9A9A] flex-shrink-0">
                              {item.count} affected ({impactPercent}%)
                            </span>
                          </div>

                          {/* Progress indicator */}
                          <div className="w-full bg-[#EFE7E1] rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#D9684C] to-[#C62828] h-full rounded-full transition-all duration-500"
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
                  Audited under Acme Retention Standard (POL-HR-COC-2026-V4) & Remote Telemetry (POL-OPS-002).
                </span>
              </div>
            </div>
          </div>

          {/* ── 6. Department Roster Roster with List/Grid Toggle ── */}
          <div className="bg-white rounded-3xl border border-[#DED1C9] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#DED1C9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-heading font-bold text-[#312C29]">
                  {selectedDept} Department Team Roster
                </h3>
                <p className="text-xs text-[#7A736E]">
                  Examine individual employee parameters, overtime burdens, and SHAP explainability
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-xl bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]">
                  {teamEmployees.length} personnel
                </span>

                <div className="flex items-center bg-[#FAF6F2] p-1 rounded-2xl border border-[#DED1C9]">
                  <button
                    onClick={() => setRosterViewMode('list')}
                    className={`p-1.5 rounded-xl transition-all ${
                      rosterViewMode === 'list'
                        ? 'bg-white text-[#312C29] shadow-xs'
                        : 'text-[#7A736E] hover:text-[#312C29]'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setRosterViewMode('grid')}
                    className={`p-1.5 rounded-xl transition-all ${
                      rosterViewMode === 'grid'
                        ? 'bg-white text-[#312C29] shadow-xs'
                        : 'text-[#7A736E] hover:text-[#312C29]'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {rosterViewMode === 'grid' ? (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="p-5 rounded-2xl bg-[#FAF6F2] border border-[#DED1C9] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#312C29] text-white font-heading font-bold flex items-center justify-center text-xs group-hover:bg-[#D9684C] transition-colors flex-shrink-0">
                            {emp.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-[#312C29] text-xs group-hover:text-[#D9684C] transition-colors line-clamp-1">
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-[#7A736E] line-clamp-1">{emp.role}</div>
                          </div>
                        </div>
                        <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} size="sm" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-xl bg-white border border-[#EFE7E1]">
                          <span className="text-[9px] text-[#7A736E] uppercase font-bold block">Tenure</span>
                          <span className="font-mono font-bold text-[#312C29]">{emp.tenure_months} mos</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-[#EFE7E1]">
                          <span className="text-[9px] text-[#7A736E] uppercase font-bold block">Overtime</span>
                          <span className={`font-mono font-bold ${emp.overtime_hours > 10 ? 'text-[#C62828]' : 'text-[#312C29]'}`}>
                            {emp.overtime_hours} hrs/wk
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#EFE7E1] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#7A736E]">Inspect TreeSHAP</span>
                      <span className="inline-flex items-center gap-1 font-bold text-[#D9684C] group-hover:translate-x-1 transition-transform">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                        <div className="text-xs font-bold font-mono text-[#312C29]">
                          {emp.tenure_months} mos
                        </div>
                      </div>

                      <div className="text-right hidden md:block">
                        <div className="text-[11px] text-[#7A736E]">Overtime</div>
                        <div
                          className={`text-xs font-bold font-mono ${
                            emp.overtime_hours > 10 ? 'text-[#C62828]' : 'text-[#312C29]'
                          }`}
                        >
                          {emp.overtime_hours} hrs/wk
                        </div>
                      </div>

                      <div className="text-right hidden md:block">
                        <div className="text-[11px] text-[#7A736E]">Engagement</div>
                        <div className="text-xs font-bold font-mono text-[#312C29]">
                          {emp.engagement_score}/4
                        </div>
                      </div>

                      <RiskBadge
                        score={emp.riskScore}
                        level={emp.riskLevel}
                        showScore={true}
                        size="sm"
                      />

                      <ChevronRight className="w-4 h-4 text-[#7A736E] group-hover:text-[#D9684C] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamViewPage;