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
    <div className="min-h-screen bg-[#FBF4EF] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-xl border border-[#DED1C9]">
        {/* Left Side: Brand & Product Value (Noovotic Espresso Editorial) */}
        <div className="bg-[#312C29] p-8 sm:p-12 text-[#FBF4EF] flex flex-col justify-between relative overflow-hidden">
          {/* Subtle warm glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D9684C]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#B2553E]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#D9684C] border border-white/10 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold tracking-tight">
                  Nirnaya<span className="text-[#D9684C]">.ai</span>
                </h1>
                <p className="text-xs text-[#FBF4EF]/70 font-medium">Workforce Intelligence Platform</p>
              </div>
            </div>

            <p className="text-[#FBF4EF]/90 text-sm leading-relaxed mb-8">
              From workforce signals to explainable, policy-backed HR decisions. Predict attrition risks early and take policy-compliant mitigation actions.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9684C] mt-0.5 flex-shrink-0" />
                <span className="text-[#FBF4EF]/90">XGBoost attrition risk scoring + SHAP factor explainability</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9684C] mt-0.5 flex-shrink-0" />
                <span className="text-[#FBF4EF]/90">RAG Policy Q&A with verifiable document citations</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9684C] mt-0.5 flex-shrink-0" />
                <span className="text-[#FBF4EF]/90">Conversational onboarding and automated profile synthesis</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-8">
            <p className="text-[11px] text-[#FBF4EF]/80 font-medium">Team Curious Coders • DSCE Hackathon</p>
            <p className="text-[10px] text-[#FBF4EF]/60">FastAPI • XGBoost • ChromaDB • Groq LLM • React</p>
          </div>
        </div>

        {/* Right Side: Role Selector & Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-heading font-bold text-[#312C29]">Sign In to Nirnaya.ai</h2>
            <p className="text-xs text-[#7A736E] mt-1">Select a role to preview the role-gated platform view</p>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-[#312C29] block">Select User Persona:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(ROLES.EMPLOYEE);
                  setUsername('rahul_dev');
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedRole === ROLES.EMPLOYEE
                    ? 'border-[#312C29] bg-[#FAF6F2] text-[#312C29] font-bold ring-2 ring-[#312C29]/10'
                    : 'border-[#DED1C9] hover:border-[#312C29]/30 text-[#5D5753] bg-white'
                }`}
              >
                <User className="w-4 h-4 mx-auto mb-1 text-[#D9684C]" />
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
                    ? 'border-[#312C29] bg-[#FAF6F2] text-[#312C29] font-bold ring-2 ring-[#312C29]/10'
                    : 'border-[#DED1C9] hover:border-[#312C29]/30 text-[#5D5753] bg-white'
                }`}
              >
                <UserCheck className="w-4 h-4 mx-auto mb-1 text-[#D9684C]" />
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
                    ? 'border-[#312C29] bg-[#FAF6F2] text-[#312C29] font-bold ring-2 ring-[#312C29]/10'
                    : 'border-[#DED1C9] hover:border-[#312C29]/30 text-[#5D5753] bg-white'
                }`}
              >
                <Shield className="w-4 h-4 mx-auto mb-1 text-[#D9684C]" />
                <div className="text-xs font-medium">HR Admin</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#312C29] block mb-1">
                Display Username / ID
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED1C9] focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C] text-xs bg-[#FAF6F2] text-[#312C29]"
              />
            </div>

            <div className="bg-[#FAF6F2] rounded-xl p-3 border border-[#DED1C9] text-[11px] text-[#7A736E]">
              <span className="font-semibold text-[#312C29] block mb-0.5">Role Permissions Gating:</span>
              {selectedRole === ROLES.EMPLOYEE && 'Access to Onboarding Agent and Policy Q&A Assistant.'}
              {selectedRole === ROLES.HR_STAFF && 'Full Risk Dashboard, SHAP Reasoning, Team Rollup, and Policy Q&A.'}
              {selectedRole === ROLES.HR_ADMIN && 'Everything HR Staff has + Full Employee Database CRUD Management.'}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#312C29] hover:bg-[#1C1816] text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.99]"
            >
              <span>Enter Workspace as {ROLE_LABELS[selectedRole]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-[#DED1C9]">
            <span className="text-[11px] font-semibold text-[#7A736E] block mb-2 text-center">
              Or 1-Click Instant Demo Login:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.HR_STAFF, 'aditi_hr')}
                className="flex-1 text-[11px] font-semibold py-2 px-2 bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#312C29] border border-[#DED1C9] rounded-xl transition-colors text-center shadow-2xs"
              >
                HR Staff Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.HR_ADMIN, 'admin_vikram')}
                className="flex-1 text-[11px] font-semibold py-2 px-2 bg-[#FAF6F2] hover:bg-[#F2EAE3] text-[#312C29] border border-[#DED1C9] rounded-xl transition-colors text-center shadow-2xs"
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
