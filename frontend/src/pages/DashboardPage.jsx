import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/api';
import RiskBadge from '../components/RiskBadge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Data & AI',
  'Product',
  'Design & UX',
  'Cybersecurity & IT',
  'Customer Success',
  'Sales',
  'Marketing',
  'Finance & Operations',
  'Human Resources'
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [sortByRisk, setSortByRisk] = useState(true); // default sort by highest risk first

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Could not connect to the backend server. Make sure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter & Search Logic
  const filteredEmployees = employees
    .filter((emp) => {
      const matchesDept =
        selectedDept === 'All Departments' ||
        emp.department?.toLowerCase() === selectedDept.toLowerCase();

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        emp.name?.toLowerCase().includes(q) ||
        emp.role?.toLowerCase().includes(q) ||
        emp.department?.toLowerCase().includes(q) ||
        (emp.skills && emp.skills.some(s => s.toLowerCase().includes(q)));

      return matchesDept && matchesSearch;
    })
    .sort((a, b) => {
      if (sortByRisk) {
        return (b.riskScore || 0) - (a.riskScore || 0);
      }
      return a.name.localeCompare(b.name);
    });

  // Calculate high-level stats
  const totalCount = employees.length;
  const highRiskCount = employees.filter((e) => (e.riskScore >= 0.7) || (e.riskLevel === 'High')).length;
  const mediumRiskCount = employees.filter((e) => (e.riskScore >= 0.4 && e.riskScore < 0.7) || (e.riskLevel === 'Medium')).length;
  const lowRiskCount = employees.filter((e) => (!e.riskScore || e.riskScore < 0.4) && (e.riskLevel === 'Low' || !e.riskLevel)).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Workforce Risk Intelligence</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Live Monitoring
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time attrition predictions powered by XGBoost with SHAP explainability factors.
          </p>
        </div>

        <button
          onClick={fetchEmployees}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200/80 shadow-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Total Monitored</span>
            <div className="text-2xl font-bold text-slate-900 font-mono">{totalCount}</div>
            <span className="text-[11px] text-slate-500">across 5 departments</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-rose-500">High Risk (&ge;70%)</span>
            <div className="text-2xl font-bold text-rose-600 font-mono">{highRiskCount}</div>
            <span className="text-[11px] text-rose-500 font-medium">Urgent intervention</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-amber-500">Medium Risk (40-69%)</span>
            <div className="text-2xl font-bold text-amber-600 font-mono">{mediumRiskCount}</div>
            <span className="text-[11px] text-amber-600 font-medium">Monitoring active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/70 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-emerald-500">Low Risk (&lt;40%)</span>
            <div className="text-2xl font-bold text-emerald-600 font-mono">{lowRiskCount}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Healthy engagement</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by employee name, role, department or skill..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortByRisk(!sortByRisk)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              sortByRisk
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortByRisk ? 'Sorted by Risk' : 'Sorted by Name'}</span>
          </button>
        </div>
      </div>

      {/* Main Table / Content */}
      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : error ? (
        <ErrorMessage
          title="Could not connect to Nirnaya.ai Backend"
          message={error}
          onRetry={fetchEmployees}
        />
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No matching employees found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or department filter to see employee profiles.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 lg:px-6">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Tenure</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Engagement</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Overtime</th>
                  <th className="py-3.5 px-4">Attrition Risk</th>
                  <th className="py-3.5 px-4 text-right">Reasoning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Name & Role */}
                    <td className="py-4 px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                          {emp.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {emp.name}
                          </div>
                          <div className="text-xs text-slate-500">{emp.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/50">
                        {emp.department}
                      </span>
                    </td>

                    {/* Tenure */}
                    <td className="py-4 px-4 hidden sm:table-cell text-xs font-mono text-slate-600">
                      {emp.tenure_months ? `${emp.tenure_months} mos` : '—'}
                    </td>

                    {/* Engagement */}
                    <td className="py-4 px-4 hidden md:table-cell text-xs font-medium">
                      <span className={`font-mono font-semibold ${
                        (emp.engagement_score || 0) <= 1.5
                          ? 'text-rose-600'
                          : (emp.engagement_score || 0) <= 2.5
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        {emp.engagement_score !== undefined ? `${emp.engagement_score}/4` : '—'}
                      </span>
                    </td>

                    {/* Overtime */}
                    <td className="py-4 px-4 hidden lg:table-cell text-xs font-mono text-slate-600">
                      {(emp.overtime_hours || 0) > 0 ? (
                        <span className="text-amber-700 font-semibold">{emp.overtime_hours} hrs/wk</span>
                      ) : (
                        <span className="text-slate-400">0 hrs</span>
                      )}
                    </td>

                    {/* Risk Badge with Score */}
                    <td className="py-4 px-4">
                      <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} />
                    </td>

                    {/* Action Link */}
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-all">
                        <span>Inspect</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
            <span className="hidden sm:inline">Click any row to open the full SHAP Risk Reasoning Panel</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
