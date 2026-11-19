import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Sparkles,
  RefreshCw,
  ExternalLink,
  LayoutGrid,
  Table as TableIcon,
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  Briefcase
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
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const deptScrollRef = useRef(null);

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

  const scrollDepts = (direction) => {
    if (deptScrollRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      deptScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Department counts for quick pills
  const deptCounts = useMemo(() => {
    const counts = { 'All Departments': employees.length };
    employees.forEach((emp) => {
      if (emp.department) {
        counts[emp.department] = (counts[emp.department] || 0) + 1;
      }
    });
    return counts;
  }, [employees]);

  // Filter & Search Logic
  const filteredEmployees = useMemo(() => {
    return employees
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
          (emp.skills && emp.skills.some((s) => s.toLowerCase().includes(q)));

        return matchesDept && matchesSearch;
      })
      .sort((a, b) => {
        if (sortByRisk) {
          return (b.riskScore || 0) - (a.riskScore || 0);
        }
        return (a.name || '').localeCompare(b.name || '');
      });
  }, [employees, selectedDept, searchQuery, sortByRisk]);

  // Calculate high-level stats
  const totalCount = employees.length;
  const highRiskCount = employees.filter(
    (e) => e.riskScore >= 0.7 || e.riskLevel === 'High'
  ).length;
  const mediumRiskCount = employees.filter(
    (e) =>
      (e.riskScore >= 0.4 && e.riskScore < 0.7) || e.riskLevel === 'Medium'
  ).length;
  const lowRiskCount = employees.filter(
    (e) =>
      (!e.riskScore || e.riskScore < 0.4) &&
      (e.riskLevel === 'Low' || !e.riskLevel)
  ).length;

  const highPct = totalCount ? Math.round((highRiskCount / totalCount) * 100) : 0;
  const medPct = totalCount ? Math.round((mediumRiskCount / totalCount) * 100) : 0;
  const lowPct = totalCount ? Math.round((lowRiskCount / totalCount) * 100) : 0;

  // Most critical flight risk for quick alert banner
  const topCriticalEmployee = useMemo(() => {
    const highRisks = employees.filter(
      (e) => e.riskScore >= 0.7 || e.riskLevel === 'High'
    );
    return highRisks.length
      ? highRisks.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0]
      : null;
  }, [employees]);

  return (
    <div className="space-y-6 pb-12">
      {/* ── 1. Editorial Header Canvas ── */}
      <div className="bg-[#FAF6F2] rounded-3xl border border-[#DED1C9] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9684C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9684C]">
                XGBoost Telemetry Engine
              </span>
              <span className="text-[10px] font-mono text-[#7A736E] bg-white px-2 py-0.5 rounded-full border border-[#DED1C9]">
                Model v2.4 • 84.2% Test Accuracy
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-[#312C29]">
              Workforce Risk Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-[#5D5753] leading-relaxed">
              Continuous enterprise monitoring combining single sign-on activity, compa-ratio benchmarks, and Game-Theoretic TreeSHAP factor isolation to identify attrition risk before notice submission.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto flex-shrink-0">
            <button
              onClick={fetchEmployees}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F5E9DF] text-[#312C29] font-bold text-xs border border-[#DED1C9] shadow-xs transition-all active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#7A736E] ${loading ? 'animate-spin' : ''}`}
              />
              <span>Refresh Telemetry</span>
            </button>

            <button
              onClick={() => navigate('/policy')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#312C29] hover:bg-[#1C1816] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D9684C]" />
              <span>Policy Assistant</span>
            </button>
          </div>
        </div>

        {/* Dynamic Workforce Risk Spectrum Bar */}
        <div className="mt-6 pt-6 border-t border-[#DED1C9] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#312C29] uppercase tracking-wider text-[10px]">
              Organizational Risk Spectrum ({totalCount} Monitored Personnel)
            </span>
            <span className="font-mono text-[11px] text-[#7A736E]">
              {lowPct}% Low • {medPct}% Watch • {highPct}% Urgent
            </span>
          </div>

          {/* Multi-Segment Spectrum Bar */}
          <div className="h-3.5 w-full bg-[#EFE7E1] rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-[#2E7D32] transition-all duration-700 hover:opacity-90"
              style={{ width: `${lowPct}%` }}
              title={`Low Risk: ${lowRiskCount} employees (${lowPct}%)`}
            />
            <div
              className="bg-[#D9684C] transition-all duration-700 hover:opacity-90"
              style={{ width: `${medPct}%` }}
              title={`Medium Risk: ${mediumRiskCount} employees (${medPct}%)`}
            />
            <div
              className="bg-[#C62828] transition-all duration-700 hover:opacity-90"
              style={{ width: `${highPct}%` }}
              title={`High Risk: ${highRiskCount} employees (${highPct}%)`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7A736E] pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span>Healthy Engagement: <strong>{lowRiskCount}</strong> ({lowPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9684C]" />
              <span>Elevated Watch: <strong>{mediumRiskCount}</strong> ({medPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
              <span>Critical Action Needed: <strong>{highRiskCount}</strong> ({highPct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Top Summary KPI Cards (Noovotic Style with Lift Hover) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#DED1C9] shadow-xs flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF6F2] text-[#312C29] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <Users className="w-6 h-6 text-[#312C29]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E] block">
              Monitored Headcount
            </span>
            <div className="text-2xl font-heading font-extrabold text-[#312C29] font-mono">
              {totalCount}
            </div>
            <span className="text-[11px] text-[#7A736E]">Across 10 departments</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#EF9A9A]/60 shadow-xs flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEBEE] text-[#C62828] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C62828] block">
              High Risk (&ge;70%)
            </span>
            <div className="text-2xl font-heading font-extrabold text-[#C62828] font-mono">
              {highRiskCount}
            </div>
            <span className="text-[11px] text-[#C62828] font-medium">
              {highPct}% of total staff
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#D9684C]/30 shadow-xs flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#FDEAE5] text-[#B2553E] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B2553E] block">
              Medium Risk (40-69%)
            </span>
            <div className="text-2xl font-heading font-extrabold text-[#B2553E] font-mono">
              {mediumRiskCount}
            </div>
            <span className="text-[11px] text-[#B2553E] font-medium">
              Active telemetry watch
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#A5D6A7]/60 shadow-xs flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center flex-shrink-0 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] block">
              Low Risk (&lt;40%)
            </span>
            <div className="text-2xl font-heading font-extrabold text-[#2E7D32] font-mono">
              {lowRiskCount}
            </div>
            <span className="text-[11px] text-[#2E7D32] font-medium">
              Healthy stability
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Urgent High-Risk Flash Alert (If Any High-Risk Exists) ── */}
      {topCriticalEmployee && (
        <div className="bg-gradient-to-r from-[#FFEBEE] via-white to-[#FAF6F2] rounded-3xl border border-[#EF9A9A] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C62828] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C62828]">
                  Urgent Retention Alert
                </span>
                <span className="text-[10px] font-mono bg-[#C62828] text-white px-2 py-0.5 rounded-full font-bold">
                  {Math.round((topCriticalEmployee.riskScore || 0.8) * 100)}% Probability
                </span>
              </div>
              <p className="text-xs text-[#312C29] mt-0.5">
                <strong className="font-semibold">{topCriticalEmployee.name}</strong> ({topCriticalEmployee.role} • {topCriticalEmployee.department}) is exhibiting peak flight signals driven by overtime burden.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/employees/${topCriticalEmployee.id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C62828] hover:bg-[#B71C1C] text-white text-xs font-bold shadow-xs transition-all active:scale-95 self-start sm:self-auto flex-shrink-0"
          >
            <span>Inspect Retention Playbook</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 4. Horizontal Quick Department Scroll Track ── */}
      <div className="relative bg-white rounded-3xl border border-[#DED1C9] p-2.5 shadow-xs flex items-center gap-2">
        {/* Left Arrow Button */}
        <button
          onClick={() => scrollDepts('left')}
          className="w-8 h-8 rounded-full border border-[#DED1C9] bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Scroll departments left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={deptScrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DEPARTMENTS.map((dept) => {
            const isSelected = selectedDept === dept;
            const count = deptCounts[dept] || 0;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#312C29] text-white shadow-xs'
                    : 'bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] hover:text-[#312C29] border border-[#DED1C9]'
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-[#D9684C] text-white'
                      : 'bg-white text-[#7A736E] border border-[#DED1C9]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scrollDepts('right')}
          className="w-8 h-8 rounded-full border border-[#DED1C9] bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#5D5753] flex items-center justify-center flex-shrink-0 transition-colors"
          aria-label="Scroll departments right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── 5. Search, Filter & View Mode Bar ── */}
      <div className="bg-white rounded-3xl border border-[#DED1C9] p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by employee name, role, department or primary skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DED1C9] text-xs bg-[#FAF6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C] transition-all text-[#312C29]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Department Dropdown fallback */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl border border-[#DED1C9] text-xs font-semibold text-[#312C29] bg-[#FAF6F2] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept} ({deptCounts[dept] || 0})
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortByRisk(!sortByRisk)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
              sortByRisk
                ? 'bg-[#312C29] border-[#312C29] text-white shadow-xs'
                : 'bg-[#FAF6F2] border-[#DED1C9] text-[#5D5753] hover:bg-[#F2EAE3]'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortByRisk ? 'Ranked by Risk' : 'Alphabetical'}</span>
          </button>

          {/* View Mode Toggle: Table vs Grid */}
          <div className="flex items-center bg-[#FAF6F2] p-1 rounded-2xl border border-[#DED1C9]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#312C29] shadow-xs'
                  : 'text-[#7A736E] hover:text-[#312C29]'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#312C29] shadow-xs'
                  : 'text-[#7A736E] hover:text-[#312C29]'
              }`}
              title="Visual Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── 6. Main Data Display: Table or Visual Card Grid ── */}
      {loading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : error ? (
        <ErrorMessage
          title="Could not connect to Nirnaya.ai Backend"
          message={error}
          onRetry={fetchEmployees}
        />
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DED1C9] p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F2] flex items-center justify-center mx-auto mb-3 text-[#7A736E]">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-heading font-bold text-[#312C29]">
            No matching employees found
          </h3>
          <p className="text-xs text-[#7A736E] mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching the department filter to view personnel.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Modern Editorial Cards Grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}`)}
              className="bg-white rounded-3xl border border-[#DED1C9] p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header: Avatar, Name & Risk Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold flex items-center justify-center text-sm shadow-xs group-hover:bg-[#D9684C] transition-colors flex-shrink-0">
                      {emp.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-heading font-bold text-[#312C29] group-hover:text-[#D9684C] transition-colors line-clamp-1">
                        {emp.name}
                      </h3>
                      <p className="text-xs text-[#7A736E] line-clamp-1">{emp.role}</p>
                    </div>
                  </div>
                  <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} size="sm" />
                </div>

                {/* Department Tag */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-semibold px-2.5 py-1 rounded-xl bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]">
                    {emp.department}
                  </span>
                  <span className="text-[#7A736E] font-mono">
                    Tenure: <strong className="text-[#312C29]">{emp.tenure_months || 0} mos</strong>
                  </span>
                </div>

                {/* Micro Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#EFE7E1]">
                    <span className="text-[10px] text-[#7A736E] uppercase font-bold block">
                      Overtime Burden
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        (emp.overtime_hours || 0) > 10
                          ? 'text-[#C62828]'
                          : (emp.overtime_hours || 0) > 0
                          ? 'text-[#B2553E]'
                          : 'text-[#2E7D32]'
                      }`}
                    >
                      {emp.overtime_hours || 0} hrs/wk
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#EFE7E1]">
                    <span className="text-[10px] text-[#7A736E] uppercase font-bold block">
                      Engagement
                    </span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        (emp.engagement_score || 0) <= 2.0
                          ? 'text-[#C62828]'
                          : (emp.engagement_score || 0) <= 3.0
                          ? 'text-[#B2553E]'
                          : 'text-[#2E7D32]'
                      }`}
                    >
                      {emp.engagement_score !== undefined ? `${emp.engagement_score}/4` : '—'}
                    </span>
                  </div>
                </div>

                {/* Skills Preview */}
                {emp.skills && emp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {emp.skills.slice(0, 3).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-white border border-[#DED1C9] text-[#5D5753]"
                      >
                        {s}
                      </span>
                    ))}
                    {emp.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-[#FAF6F2] text-[#7A736E]">
                        +{emp.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Inspect Trigger */}
              <div className="pt-4 mt-4 border-t border-[#EFE7E1] flex items-center justify-between text-xs">
                <span className="text-[#7A736E] text-[11px]">TreeSHAP Factor Analysis</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#D9684C] group-hover:text-[#B2553E] group-hover:translate-x-1 transition-all">
                  <span>Inspect Risk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Classic Enhanced Table View ── */
        <div className="bg-white rounded-3xl border border-[#DED1C9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6F2] border-b border-[#DED1C9] text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                  <th className="py-4 px-4 lg:px-6">Employee</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4 hidden sm:table-cell">Tenure</th>
                  <th className="py-4 px-4 hidden md:table-cell">Engagement</th>
                  <th className="py-4 px-4 hidden lg:table-cell">Overtime</th>
                  <th className="py-4 px-4">Attrition Risk</th>
                  <th className="py-4 px-4 text-right">Reasoning</th>
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
                        <div className="w-9 h-9 rounded-xl bg-[#312C29] text-[#FBF4EF] font-heading font-bold flex items-center justify-center text-xs group-hover:bg-[#D9684C] transition-colors flex-shrink-0">
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
                      <span
                        className={`font-mono font-bold ${
                          (emp.engagement_score || 0) <= 1.5
                            ? 'text-[#C62828]'
                            : (emp.engagement_score || 0) <= 2.5
                            ? 'text-[#B2553E]'
                            : 'text-[#2E7D32]'
                        }`}
                      >
                        {emp.engagement_score !== undefined
                          ? `${emp.engagement_score}/4`
                          : '—'}
                      </span>
                    </td>

                    {/* Overtime */}
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs font-mono text-[#5D5753]">
                      {(emp.overtime_hours || 0) > 0 ? (
                        <span className="text-[#B2553E] font-bold">
                          {emp.overtime_hours} hrs/wk
                        </span>
                      ) : (
                        <span className="text-[#7A736E]">0 hrs</span>
                      )}
                    </td>

                    {/* Risk Badge with Score */}
                    <td className="py-3.5 px-4">
                      <RiskBadge
                        score={emp.riskScore}
                        level={emp.riskLevel}
                        showScore={true}
                      />
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

          <div className="px-6 py-3.5 bg-[#FAF6F2] border-t border-[#DED1C9] text-[11px] text-[#7A736E] flex items-center justify-between">
            <span>
              Showing {filteredEmployees.length} of {employees.length} monitored personnel
            </span>
            <span className="hidden sm:inline">
              Click any row to open the full TreeSHAP Factor Analysis & Policy Playbook
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;