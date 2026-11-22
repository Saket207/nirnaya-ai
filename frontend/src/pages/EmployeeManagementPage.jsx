import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Pencil,
  Trash2,
  Search,
  X,
  Check,
  AlertCircle,
  Building,
  Briefcase,
  User,
  Shield,
  Clock,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../api/api';
import RiskBadge from '../components/RiskBadge';
import { TableSkeleton } from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = [
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

const INITIAL_FORM_STATE = {
  name: '',
  role: '',
  department: 'Engineering',
  tenure_months: 12,
  engagement_score: 3.0,
  time_since_promotion_months: 6,
  overtime_hours: 0.0,
  JobLevel: 1,
  WorkLifeBalance: 3,
  skills: 'Python, FastAPI, React',
  recommendedAction: ''
};

const EmployeeManagementPage = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to load employee list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData(INITIAL_FORM_STATE);
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      role: emp.role || '',
      department: emp.department || 'Engineering',
      tenure_months: emp.tenure_months ?? 12,
      engagement_score: emp.engagement_score ?? 3.0,
      time_since_promotion_months: emp.time_since_promotion_months ?? 6,
      overtime_hours: emp.overtime_hours ?? 0.0,
      JobLevel: emp.JobLevel ?? 1,
      WorkLifeBalance: emp.WorkLifeBalance ?? 3,
      skills: Array.isArray(emp.skills) ? emp.skills.join(', ') : '',
      recommendedAction: emp.recommendedAction || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim() || !formData.role.trim() || !formData.department.trim()) {
      toast.warning('Name, Role, and Department are required.');
      return;
    }

    setSubmitting(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        department: formData.department.trim(),
        tenure_months: parseInt(formData.tenure_months, 10) || 0,
        engagement_score: parseFloat(formData.engagement_score) || 3.0,
        time_since_promotion_months: parseInt(formData.time_since_promotion_months, 10) || 0,
        overtime_hours: parseFloat(formData.overtime_hours) || 0.0,
        JobLevel: parseInt(formData.JobLevel, 10) || 1,
        WorkLifeBalance: parseInt(formData.WorkLifeBalance, 10) || 3,
        skills: skillsArray,
        recommendedAction: formData.recommendedAction || undefined
      };

      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.id, payload);
        toast.success(`Updated ${formData.name} successfully!`);
      } else {
        const created = await api.createEmployee(payload);
        toast.success(`Created ${created.name} successfully!`);
        // Trigger initial risk calculation
        try {
          await api.getEmployeeRisk(created.id);
        } catch (e) {
          // ignore
        }
      }

      closeModal();
      fetchEmployees();
    } catch (err) {
      console.error('Error submitting employee:', err);
      toast.error('Failed to save employee: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete employee "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteEmployee(id);
      toast.success(`Deleted employee ${name}.`);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting employee:', err);
      toast.error('Failed to delete employee: ' + (err.message || 'Server error'));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold tracking-tight text-[#312C29] flex items-center gap-2.5">
            <span>Employee Directory Management</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/30 uppercase tracking-wider">
              HR Admin Exclusive
            </span>
          </h1>
          <p className="text-xs text-[#7A736E] mt-0.5">
            Create, update, or remove workforce records and configure training features directly in PostgreSQL.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#312C29] hover:bg-[#1C1816] text-white font-semibold text-xs transition-all shadow-xs active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DED1C9] p-4 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A736E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee directory by name, role, or department..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED1C9] text-xs bg-[#FAF6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C] text-[#312C29]"
          />
        </div>
        <button
          onClick={fetchEmployees}
          className="p-2 text-[#7A736E] hover:text-[#312C29] rounded-lg hover:bg-[#F2EAE3] transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={8} cols={6} />
      ) : error ? (
        <ErrorMessage
          title="Could not load employee records"
          message={error}
          onRetry={fetchEmployees}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#DED1C9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF6F2] border-b border-[#DED1C9] text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                  <th className="py-3.5 px-4 lg:px-6">Name / Role</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tenure</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Engagement</th>
                  <th className="py-3.5 px-4">Risk Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EAE3]">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#FBF4EF] transition-colors">
                    <td className="py-3.5 px-4 lg:px-6">
                      <div className="font-semibold text-[#312C29]">{emp.name}</div>
                      <div className="text-[11px] text-[#7A736E]">{emp.role}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#FAF6F2] text-[#312C29] border border-[#DED1C9]">
                        {emp.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs font-mono text-[#5D5753]">
                      {emp.tenure_months} mos
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-xs font-mono font-bold text-[#312C29]">
                      {emp.engagement_score}/4
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge score={emp.riskScore} level={emp.riskLevel} showScore={true} size="xs" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 text-[#7A736E] hover:text-[#D9684C] hover:bg-[#FDEAE5] rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id, emp.name)}
                          disabled={deletingId === emp.id}
                          className="p-1.5 text-[#7A736E] hover:text-[#C62828] hover:bg-[#FFEBEE] rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#FAF6F2] border-t border-[#DED1C9] text-[11px] text-[#7A736E]">
            Total {filtered.length} employee records catalogued in database
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#312C29]/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white rounded-3xl border border-[#DED1C9] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#DED1C9] mb-6">
              <div>
                <h3 className="text-lg font-heading font-bold text-[#312C29]">
                  {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : 'Create New Employee Profile'}
                </h3>
                <p className="text-xs text-[#7A736E]">
                  {editingEmployee
                    ? 'Update employee record and trigger model recalculation'
                    : 'New records are persisted to PostgreSQL and evaluated by XGBoost'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 text-[#7A736E] hover:text-[#312C29] rounded-lg hover:bg-[#FAF6F2] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#312C29] block mb-1">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Krishnan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#312C29] block mb-1">
                    Job Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Frontend Developer"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#312C29] block mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#312C29] block mb-1">
                    Tenure (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.tenure_months}
                    onChange={(e) => setFormData({ ...formData, tenure_months: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                  />
                </div>
              </div>

              {/* ML Features Section */}
              <div className="p-4 bg-[#FAF6F2] rounded-2xl border border-[#DED1C9] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B2553E] block">
                  ML Predictor Inputs (XGBoost Features)
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-[#5D5753] block mb-1">
                      Engagement (1-4)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="4.0"
                      value={formData.engagement_score}
                      onChange={(e) => setFormData({ ...formData, engagement_score: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DED1C9] bg-white text-[#312C29]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5D5753] block mb-1">
                      No Promo (Mos)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.time_since_promotion_months}
                      onChange={(e) => setFormData({ ...formData, time_since_promotion_months: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DED1C9] bg-white text-[#312C29]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5D5753] block mb-1">
                      Overtime (Hrs/Wk)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.overtime_hours}
                      onChange={(e) => setFormData({ ...formData, overtime_hours: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DED1C9] bg-white text-[#312C29]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5D5753] block mb-1">
                      Work-Life (1-4)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={formData.WorkLifeBalance}
                      onChange={(e) => setFormData({ ...formData, WorkLifeBalance: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#DED1C9] bg-white text-[#312C29]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#312C29] block mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Python, Machine Learning, FastAPI, PostgreSQL"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#312C29] block mb-1">
                  Custom Recommended Action (Optional Override)
                </label>
                <textarea
                  rows="2"
                  value={formData.recommendedAction}
                  onChange={(e) => setFormData({ ...formData, recommendedAction: e.target.value })}
                  placeholder="e.g. Offer retention bonus under POL-HR-COC-2026-V4 and cap overtime..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DED1C9] text-[#312C29] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DED1C9]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-[#5D5753] hover:text-[#312C29] hover:bg-[#FAF6F2] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#312C29] hover:bg-[#1C1816] disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-xs active:scale-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : editingEmployee ? 'Update Record' : 'Save Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementPage;
