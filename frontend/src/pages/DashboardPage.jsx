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
          <h1 className="text-2xl font-heading font-bold tracking-tight text-[#312C29] flex items-center gap-2.5">
            <span>Workforce Risk Intelligence</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/30 uppercase tracking-wider">
              Live Monitoring
            </span>
          </h1>
          <p className="text-xs text-[#7A736E] mt-0.5">
            Real-time attrition predictions powered by XGBoost with SHAP explainability factors.
          </p>
        </div>

        <button
          onClick={fetchEmployees}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5E9DF] text-[#312C29] font-semibold text-xs border border-[#DED1C9] shadow-xs transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#7A736E] ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DED1C9] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5E9DF] text-[#312C29] flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">Total Monitored</span>
            <div className="text-2xl font-bold text-[#312C29] font-mono">{totalCount}</div>
            <span className="text-[11px] text-[#7A736E]">across 10 departments</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EF9A9A]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828]">High Risk (&ge;70%)</span>
            <div className="text-2xl font-bold text-[#C62828] font-mono">{highRiskCount}</div>
            <span className="text-[11px] text-[#C62828] font-medium">Urgent intervention</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D9684C]/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FDEAE5] text-[#B2553E] flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B2553E]">Medium Risk (40-69%)</span>
            <div className="text-2xl font-bold text-[#B2553E] font-mono">{mediumRiskCount}</div>
            <span className="text-[11px] text-[#B2553E] font-medium">Monitoring active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#A5D6A7]/60 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">Low Risk (&lt;40%)</span>
            <div className="text-2xl font-bold text-[#2E7D32] font-mono">{lowRiskCount}</div>
            <span className="text-[11px] text-[#2E7D32] font-medium">Healthy engagement</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DED1C9] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by employee name, role, department or skill..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED1C9] text-xs bg-[#FBF4EF]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C] transition-all text-[#312C29]"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#DED1C9] text-xs font-semibold text-[#312C29] bg-[#FAF6F2] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 cursor-pointer"
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
                ? 'bg-[#312C29] border-[#312C29] text-white shadow-xs'
                : 'bg-white border-[#DED1C9] text-[#5D5753] hover:bg-[#F5E9DF]'
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
        <div className="bg-white rounded-2xl border border-[#DED1C9] p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F5E9DF] flex items-center justify-center mx-auto mb-3 text-[#7A736E]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-bold text-[#312C29]">No matching employees found</h3>
          <p className="text-xs text-[#7A736E] mt-1 max-w-sm mx-auto">
            Try adjusting your search query or department filter to see employee profiles.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DED1C9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6F2] border-b border-[#DED1C9] text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                  <th className="py-3.5 px-4 lg:px-6">Employee</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Tenure</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Engagement</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Overtime</th>
                  <th className="py-3.5 px-4">Attrition Risk</th>
                  <th className="py-3.5 px-4 text-right">Reasoning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE3]">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="hover:bg-[#FBF4EF] cursor-pointer transition-colors group"
                  >
                    {/* Name & Role */}
                    <td className="py-3.5 px-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold flex items-center justify-center text-xs group-hover:bg-[#D9684C] transition-colors">
                          {emp.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#312C29] group-hover:text-[#D9684C] transition-colors text-xs">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-[#7A736E]">{emp.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]">
                        {emp.department}
                      </span>
                    </td>

                    {/* Tenure */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-xs font-mono text-[#5D5753]">
                      {emp.tenure_months ? `${emp.tenure_months} mos` : '—'}
                    </td>

                    {/* Engagement */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs font-medium">
                      <span className={`font-mono font-bold ${
                        (emp.engagement_score || 0) <= 1.5
                          ? 'text-[#C62828]'
                          : (emp.engagement_score || 0) <= 2.5
                          ? 'text-[#B2553E]'
                          : 'text-[#2E7D32]'
                      }`}>
                        {emp.engagement_score !== undefined ? `${emp.engagement_score}/4` : '—'}
                      </span>
                    </td>

                    {/* Overtime */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs font-mono text-[#5D5753]">
                      {(emp.overtime_hours || 0) > 0 ? (
                        <span className="text-[#B2553E] font-bold">{emp.overtime_hours} hrs/wk</span>
                      ) : (
                        <span className="text-[#7A736E]">0 hrs</span>
                      )}
                    </td>

                    {/* Risk Badge with Score */}
                    <td className="py-3.5 px-4">
                      <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} />
                    </td>

                    {/* Action Link */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D9684C] group-hover:text-[#B2553E] group-hover:translate-x-0.5 transition-all">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#FAF6F2] border-t border-[#DED1C9] text-[11px] text-[#7A736E] flex items-center justify-between">
            <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
            <span className="hidden sm:inline">Click any row to open the full SHAP Risk Reasoning Panel</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
