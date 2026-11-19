import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  User,
  UserCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(ROLES.HR_STAFF);
  const [username, setUsername] = useState('aditi_hr');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, username);
    toast.success(`Logged in successfully as ${ROLE_LABELS[selectedRole]}`);

    if (selectedRole === ROLES.EMPLOYEE) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = (role, defaultUser) => {
    setSelectedRole(role);
    setUsername(defaultUser);
    login(role, defaultUser);
    toast.success(`Signed in as ${ROLE_LABELS[role]}`);

    if (role === ROLES.EMPLOYEE) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
        {/* Left Side: Brand & Product Value */}
        <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-800 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Nirnaya<span className="text-indigo-200">.ai</span></h1>
                <p className="text-xs text-indigo-200 font-medium">Workforce Intelligence Platform</p>
              </div>
            </div>

            <p className="text-indigo-100 text-sm leading-relaxed mb-8">
              From workforce signals to explainable, policy-backed HR decisions. Predict attrition risks early and take policy-compliant mitigation actions.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-50">XGBoost attrition risk scoring + SHAP factor explainability</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-50">RAG Policy Q&A with verifiable document citations</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
                <span className="text-indigo-50">Conversational onboarding and automated profile synthesis</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
            <p className="text-[11px] text-indigo-200 font-medium">Team Curious Coders • DSCE Hackathon</p>
            <p className="text-[10px] text-indigo-300">FastAPI • XGBoost • ChromaDB • Groq LLM • React</p>
          </div>
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign In to Nirnaya.ai</h2>
            <p className="text-xs text-slate-500 mt-1">Select a role to preview the role-gated platform view</p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-slate-600 block">Select User Persona:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(ROLES.EMPLOYEE);
                  setUsername('rahul_dev');
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === ROLES.EMPLOYEE
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1 text-brand-600" />
                <div className="text-xs font-medium">Employee</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole(ROLES.HR_STAFF);
                  setUsername('aditi_hr');
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === ROLES.HR_STAFF
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-brand-600" />
                <div className="text-xs font-medium">HR Staff</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole(ROLES.HR_ADMIN);
                  setUsername('vikram_admin');
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === ROLES.HR_ADMIN
                    ? 'border-brand-600 bg-brand-50/70 text-brand-700 font-semibold ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <Shield className="w-4 h-4 mx-auto mb-1 text-brand-600" />
                <div className="text-xs font-medium">HR Admin</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Display Username / ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-sm bg-slate-50/50"
              />
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700 block mb-0.5">Role Permissions Gating:</span>
              {selectedRole === ROLES.EMPLOYEE && 'Access to Onboarding Agent and Policy Q&A Assistant.'}
              {selectedRole === ROLES.HR_STAFF && 'Full Risk Dashboard, SHAP Reasoning, Team Rollup, and Policy Q&A.'}
              {selectedRole === ROLES.HR_ADMIN && 'Everything HR Staff has + Full Employee Database CRUD Management.'}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all active:scale-[0.99]"
            >
              <span>Enter Workspace as {ROLE_LABELS[selectedRole]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center">
              Or 1-Click Instant Demo Login:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.HR_STAFF, 'aditi_hr')}
                className="flex-1 text-[11px] font-medium py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-center"
              >
                HR Staff Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.HR_ADMIN, 'admin_vikram')}
                className="flex-1 text-[11px] font-medium py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-center"
              >
                HR Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
