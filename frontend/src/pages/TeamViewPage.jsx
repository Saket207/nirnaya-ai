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
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { api } from '../api/api';
import RiskBadge from '../components/RiskBadge';
import { CardSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Product',
  'Human Resources',
  'Marketing'
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
      // 1. Fetch team risk rollup summary
      const summary = await api.getTeamRiskSummary(dept);
      setSummaryData(summary);

      // 2. Fetch all employees in this department for drill-down table
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

  // Prepare chart data for Recharts
  const chartData = summaryData
    ? [
        { name: 'Low Risk', count: summaryData.low_risk_count, color: '#10b981' },
        { name: 'Medium Risk', count: summaryData.medium_risk_count, color: '#f59e0b' },
        { name: 'High Risk', count: summaryData.high_risk_count, color: '#ef4444' },
      ]
    : [];

  const topFactor = summaryData?.common_risk_factors?.[0];

  return (
    <div className="space-y-6">
      {/* Header & Department Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Team-Level Risk Analytics</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Department Rollup
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Identify organizational patterns, common burnout drivers, and team-wide attrition exposure.
          </p>
        </div>

        {/* Department Tab Pills */}
        <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {dept}
            </button>
          ))}
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
          title={`No Records for ${selectedDept}`}
          message={error}
          onRetry={() => fetchTeamData(selectedDept)}
        />
      ) : !summaryData ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <h3 className="text-base font-semibold text-slate-800">No data found</h3>
        </div>
      ) : (
        <>
          {/* Executive Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xs border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-brand-300">
              <Sparkles className="w-4 h-4" />
              <span>Department Intelligence Summary</span>
            </div>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-slate-100">
              {summaryData.summary}
            </p>
          </div>

          {/* Department KPIs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-semibold uppercase text-slate-400">Total Team Size</span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
                {summaryData.total_employees}
              </div>
              <span className="text-xs text-slate-500">active team members</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs">
              <span className="text-xs font-semibold uppercase text-rose-500">High Risk Count</span>
              <div className="text-3xl font-extrabold text-rose-600 font-mono mt-1">
                {summaryData.high_risk_count}
              </div>
              <span className="text-xs text-rose-600 font-medium">Critical attention needed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xs font-semibold uppercase text-amber-500">Medium Risk Count</span>
              <div className="text-3xl font-extrabold text-amber-600 font-mono mt-1">
                {summaryData.medium_risk_count}
              </div>
              <span className="text-xs text-amber-600 font-medium">Elevated watch list</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-xs font-semibold uppercase text-emerald-500">Low Risk Count</span>
              <div className="text-3xl font-extrabold text-emerald-600 font-mono mt-1">
                {summaryData.low_risk_count}
              </div>
              <span className="text-xs text-emerald-600 font-medium">Stable members</span>
            </div>
          </div>

          {/* Charts and Common Factors Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Risk Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Risk Severity Breakdown</h3>
                  <p className="text-xs text-slate-500">Employee count by risk category</p>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-400" />
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(val) => [`${val} Employees`, 'Count']}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Common Risk Factors in Department */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Most Common Risk Drivers</h3>
                    <p className="text-xs text-slate-500">Top factors detected by SHAP across this team</p>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                </div>

                {summaryData.common_risk_factors && summaryData.common_risk_factors.length > 0 ? (
                  <div className="space-y-3">
                    {summaryData.common_risk_factors.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-800 font-medium leading-relaxed">
                            {item.factor}
                          </span>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex-shrink-0">
                          {item.count} affected
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No active risk drivers recorded for this team.
                  </div>
                )}
              </div>

              {topFactor && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                  <span>Primary organizational concern:</span>
                  <span className="font-semibold text-rose-600">{topFactor.count} members impacted</span>
                </div>
              )}
            </div>
          </div>

          {/* Department Members List */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedDept} Team Roster</h3>
                <p className="text-xs text-slate-500">Click any team member to examine their full SHAP reasoning</p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500">
                {teamEmployees.length} members
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {teamEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => navigate(`/employees/${emp.id}`)}
                  className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                      {emp.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                        {emp.name}
                      </div>
                      <div className="text-xs text-slate-500">{emp.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-slate-400">Engagement</div>
                      <div className="text-xs font-bold font-mono text-slate-700">
                        {emp.engagement_score}/4
                      </div>
                    </div>

                    <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} />

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
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
