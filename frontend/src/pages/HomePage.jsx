import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Users2,
  BookOpen,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  Lock,
  ChevronRight,
  ExternalLink,
  Cpu,
  Compass,
  Briefcase,
  Zap,
  BarChart3,
  Server
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

// High-resolution photography assets from Noovotic CDN & workspace intelligence
const ASSETS = {
  heroWorkspace: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c46a038c5276c46c28d8_three-colleagues-gathered-around-a-table-writing-n.webp',
  teamReview: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c7c42ec1a182b8ddb_two-colleagues-reviewing-a-tablet-by-a-large-windo.webp',
  meeting: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3deb309b2314ae7589e_man-presenting-to-colleagues-in-a-bright-meeting-r.webp',
  portraitWoman: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd8b371d14f8868b08_black-and-white-portrait-of-a-woman-with-wind-blow.webp',
  portraitMan: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3ddcabca94c5e665e7a_black-and-white-portrait-of-a-smiling-man-wearing-.webp',
  portraitExecutive: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd1808a1d01d0fe115_black-and-white-portrait-of-a-young-man.webp',
  deskWork: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c59f40751e40a0ac3_smiling-professional-holding-a-folder-at-his-desk-.webp'
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const handleQuickLaunch = (role, defaultUser) => {
    login(role, defaultUser);
    if (role === ROLES.EMPLOYEE) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF4EF] text-[#312C29] selection:bg-[#D9684C] selection:text-white font-sans">
      {/* ── 1. Top Navigation Bar (Noovotic Minimalist Header) ── */}
      <header className="sticky top-0 z-50 bg-[#FBF4EF]/90 backdrop-blur-md border-b border-[#DED1C9] px-6 lg:px-12 h-20 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#D9684C] flex items-center justify-center font-heading font-bold shadow-md shadow-[#312C29]/15 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-heading font-bold tracking-tight text-[#312C29]">
                Nirnaya<span className="text-[#D9684C]">.ai</span>
              </span>
              <span className="text-[10px] font-bold bg-[#FDEAE5] text-[#B2553E] px-2 py-0.5 rounded-full border border-[#D9684C]/30 uppercase tracking-wider">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#7A736E] font-medium tracking-wide">Workforce Intelligence</p>
          </div>
        </Link>

        {/* Center Nav Anchors */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#5D5753]">
          <a href="#solutions" className="hover:text-[#312C29] transition-colors">Solutions</a>
          <a href="#methodology" className="hover:text-[#312C29] transition-colors">Methodology</a>
          <a href="#architecture" className="hover:text-[#312C29] transition-colors">AI Architecture</a>
          <a href="#cases" className="hover:text-[#312C29] transition-colors">Evidence</a>
          <a href="#insights" className="hover:text-[#312C29] transition-colors">Research</a>
        </nav>

        {/* Right CTA / Auth Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-[#5D5753] bg-white px-3.5 py-1.5 rounded-full border border-[#DED1C9]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="font-mono text-[11px]">DSCE Hackathon 2026</span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => navigate(user?.role === ROLES.EMPLOYEE ? '/onboarding' : '/dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#312C29] hover:bg-[#1C1816] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-[#5D5753] hover:text-[#312C29] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleQuickLaunch(ROLES.HR_STAFF, 'aditi_hr')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#312C29] hover:bg-[#1C1816] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                <span>Launch Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. Hero Section: Editorial Intelligence Canvas ── */}
      <section className="relative px-6 lg:px-12 pt-14 pb-20 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D9684C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left 7 Columns: Vision & Headline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FDEAE5] text-[#B2553E] border border-[#D9684C]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D9684C]" />
              <span>AI-Driven Workforce Intelligence & Policy Governance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-[#312C29] leading-[1.08]">
              Giving your workforce decisions the intelligence they truly deserve.
            </h1>

            <p className="text-base sm:text-lg text-[#5D5753] leading-relaxed max-w-2xl">
              Stop relying on lagging exit interviews. Nirnaya unifies continuous attendance and compensation telemetry, mathematically explainable XGBoost attrition risk scoring, and vector policy governance into an executive command center.
            </p>

            {/* CTAs and 1-Click Persona Triggers */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleQuickLaunch(ROLES.HR_STAFF, 'aditi_hr')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#312C29] hover:bg-[#1C1816] text-white text-xs font-bold shadow-md shadow-[#312C29]/15 transition-all active:scale-95"
              >
                <span>Explore Live Platform</span>
                <ArrowRight className="w-4 h-4 text-[#D9684C]" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F5E9DF] text-[#312C29] border border-[#DED1C9] text-xs font-bold transition-all shadow-2xs"
              >
                <span>Select User Persona</span>
              </button>
            </div>

            {/* Founder & Research Charter Card (Inspired by Daniel Hamilton in Noovotic) */}
            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#DED1C9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#312C29] text-[#D9684C] font-heading font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                  CC
                </div>
                <div>
                  <h4 className="text-xs font-heading font-bold text-[#312C29]">Team Curious Coders</h4>
                  <p className="text-[11px] text-[#7A736E]">Dayananda Sagar College of Engineering • AI in HR</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#5D5753]">
                <div className="border-l border-[#DED1C9] pl-4 hidden sm:block">
                  <span className="block text-[10px] uppercase font-bold text-[#7A736E]">ML Accuracy</span>
                  <strong className="font-mono text-[#312C29] text-sm">84.2%</strong>
                </div>
                <div className="border-l border-[#DED1C9] pl-4">
                  <span className="block text-[10px] uppercase font-bold text-[#7A736E]">Policy Books</span>
                  <strong className="font-mono text-[#312C29] text-sm">4 Handbooks</strong>
                </div>
                <div className="border-l border-[#DED1C9] pl-4">
                  <span className="block text-[10px] uppercase font-bold text-[#7A736E]">RAG Latency</span>
                  <strong className="font-mono text-[#2E7D32] text-sm">&lt;95ms</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Visual Image & Floating UI Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Editorial Image */}
              <div className="rounded-3xl overflow-hidden border border-[#DED1C9] shadow-xl bg-white">
                <img
                  src={ASSETS.heroWorkspace}
                  alt="Enterprise Workforce Strategy Team"
                  className="w-full h-[400px] object-cover filter contrast-[1.03]"
                />
              </div>

              {/* Floating Live AI Risk Card */}
              <div className="absolute -bottom-8 -left-6 sm:-left-8 bg-white p-5 rounded-2xl border border-[#DED1C9] shadow-2xl max-w-xs animate-in slide-in-from-bottom-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A736E]">Live XGBoost Score</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#A5D6A7]">
                    Low Risk (23%)
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#312C29]">Saket Kumar • Senior Backend Lead</div>
                  <div className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] text-[11px] text-[#5D5753] leading-relaxed">
                    <strong className="text-[#312C29]">SHAP Attribution:</strong> 0 hrs/wk excessive overtime protects against burnout; 0 mos promotion lag indicates active leveling.
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#7A736E]">
                    <span>Policy Standard: POL-HR-COC-2026-V4</span>
                    <span className="text-[#2E7D32] font-bold">Policy-Verified ✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Strategic Values (Noovotic's "Our Core Values Guide All We Do") ── */}
      <section className="px-6 lg:px-12 py-16 bg-[#FAF6F2] border-y border-[#DED1C9]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">Foundational Pillars</span>
            <h2 className="text-3xl font-heading font-bold text-[#312C29]">
              Our core values guide every workforce decision.
            </h2>
            <p className="text-xs text-[#7A736E]">
              We engineered Nirnaya to replace intuition-based guessing with transparent mathematics and strict organizational governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-[#DED1C9] shadow-xs space-y-4 hover:border-[#D9684C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6F2] text-[#D9684C] flex items-center justify-center font-bold">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#312C29]">Explainability Over Black Boxes</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                HR leaders cannot defend algorithmic decisions they cannot explain. Nirnaya uses TreeSHAP attribution to pinpoint the exact dollar, month, and hour driving every attrition forecast.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#DED1C9] shadow-xs space-y-4 hover:border-[#D9684C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6F2] text-[#D9684C] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#312C29]">Policy Verification Guardrails</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Interventions must never violate internal equity guidelines or collective agreements. All mitigation plans are audited against active corporate handbooks with verified section citations.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-[#DED1C9] shadow-xs space-y-4 hover:border-[#D9684C]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6F2] text-[#D9684C] flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-bold text-[#312C29]">Continuous Signal Telemetry</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Single sign-on heartbeats, overtime trends, and compa-ratio benchmarks detect flight signals months in advance, giving managers time to conduct meaningful retention conversations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Areas of Expertise / Core Capabilities Matrix ── */}
      <section id="solutions" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">Platform Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#312C29]">
              Feature highlights that power modern workforce intelligence.
            </h2>
          </div>
          <p className="text-xs text-[#7A736E] max-w-md">
            Four specialized engines working in concert to bridge raw HR data with verified leadership decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#FBF4EF] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">XGBoost & SHAP Risk Engine</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Trained on enterprise attrition datasets with 84% accuracy. Computes flight probability and isolates push vs pull drivers.
              </p>
            </div>
            <div className="pt-6 border-t border-[#DED1C9] mt-6">
              <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9684C] group-hover:text-[#B2553E] transition-colors">
                <span>View Risk Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#FBF4EF] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">10 Department Rollups</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Organizational health scoring, overtime burnout indices, and systemic risk aggregation across Engineering, Data & AI, Sales, and Ops.
              </p>
            </div>
            <div className="pt-6 border-t border-[#DED1C9] mt-6">
              <Link to="/teams" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9684C] group-hover:text-[#B2553E] transition-colors">
                <span>Inspect Team Rollups</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#FBF4EF] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Policy Q&A Intelligence</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                ChromaDB vector retrieval + Groq LLM indexing 4 policy books with 35+ verified inquiries and exact handbook section citations.
              </p>
            </div>
            <div className="pt-6 border-t border-[#DED1C9] mt-6">
              <Link to="/policy" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9684C] group-hover:text-[#B2553E] transition-colors">
                <span>Ask Policy Assistant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#312C29] text-[#FBF4EF] flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">AI Onboarding Studio</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Multi-turn conversational profile extraction, PDF resume parsing, dynamic skills taxonomy, and tailored 30-60-90 day milestone roadmaps.
              </p>
            </div>
            <div className="pt-6 border-t border-[#DED1C9] mt-6">
              <Link to="/onboarding" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9684C] group-hover:text-[#B2553E] transition-colors">
                <span>Launch Onboarding</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. The 4-Stage Methodology (Noovotic's "Process that begins with common sense") ── */}
      <section id="methodology" className="px-6 lg:px-12 py-20 bg-[#FAF6F2] border-y border-[#DED1C9]">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">Operational Flow</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#312C29]">
              A strategic process that begins with common sense.
            </h2>
            <p className="text-xs text-[#7A736E]">
              How Nirnaya converts continuous enterprise noise into high-confidence, policy-verified human capital decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 relative">
              <span className="text-3xl font-heading font-extrabold text-[#D9684C] block">01</span>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Observe (Telemetry)</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Continuous ingestion of Okta SSO session logins, overtime hours, compensation compa-ratios, and Culture Amp sentiment pulse scores.
              </p>
              <div className="pt-3 border-t border-[#DED1C9] text-[10px] text-[#7A736E] font-mono">
                Provider: Okta SSO / Workday API
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 relative">
              <span className="text-3xl font-heading font-extrabold text-[#D9684C] block">02</span>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Quantify (XGBoost)</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Trained gradient boosted trees compute calibrated flight probabilities, categorizing every team member into Low, Medium, or High risk tiers.
              </p>
              <div className="pt-3 border-t border-[#DED1C9] text-[10px] text-[#7A736E] font-mono">
                Model: XGBClassifier (84% Acc)
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 relative">
              <span className="text-3xl font-heading font-extrabold text-[#D9684C] block">03</span>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Explain (SHAP)</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Game-theoretic Shapley values mathematically isolate primary attrition drivers (overtime burden, stagnation lag) from protective factors.
              </p>
              <div className="pt-3 border-t border-[#DED1C9] text-[10px] text-[#7A736E] font-mono">
                Engine: TreeExplainer Attribution
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 relative">
              <span className="text-3xl font-heading font-extrabold text-[#D9684C] block">04</span>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Intervene (Policy RAG)</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Synthesizes individualized retention action plans verified against official employee handbooks, expense caps, and WFH policies.
              </p>
              <div className="pt-3 border-t border-[#DED1C9] text-[10px] text-[#7A736E] font-mono">
                Verification: ChromaDB + Groq LLM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Evidence & Case Studies (Noovotic's "We help brands grow") ── */}
      <section id="cases" className="px-6 lg:px-12 py-20 max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">Proven Outcomes</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#312C29]">
              Real-world workforce intelligence in action.
            </h2>
          </div>
          <p className="text-xs text-[#7A736E] max-w-md">
            Examining how explainable SHAP modeling prevents unforced turnover in high-demand technical and revenue teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Case 1 */}
          <div className="bg-white rounded-3xl border border-[#DED1C9] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <img src={ASSETS.teamReview} alt="Engineering Case Study" className="w-full h-48 object-cover filter contrast-[1.02]" />
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#312C29]">Engineering</span>
                <span className="font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#A5D6A7]">Resolved</span>
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Senior Backend Lead Overtime Mitigation</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Telemetry detected 14 consecutive weeks of &gt;12 hrs overtime. Nirnaya recommended a sprint workload rebalance with verified WFH rest-day compliance.
              </p>
            </div>
          </div>

          {/* Case 2 */}
          <div className="bg-white rounded-3xl border border-[#DED1C9] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <img src={ASSETS.meeting} alt="Data AI Case Study" className="w-full h-48 object-cover filter contrast-[1.02]" />
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#312C29]">Data & AI</span>
                <span className="font-semibold text-[#D9684C] bg-[#FDEAE5] px-2 py-0.5 rounded-full border border-[#D9684C]/30">Calibrated</span>
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Staff ML Engineer Stagnation Guardrail</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                SHAP identified 18 months without level calibration despite top quartile code contributions. Prompted automated promotion review under Section 2.1.
              </p>
            </div>
          </div>

          {/* Case 3 */}
          <div className="bg-white rounded-3xl border border-[#DED1C9] overflow-hidden shadow-xs hover:shadow-md transition-shadow">
            <img src={ASSETS.deskWork} alt="Product Case Study" className="w-full h-48 object-cover filter contrast-[1.02]" />
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#312C29]">Product & Design</span>
                <span className="font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full border border-[#A5D6A7]">Protected</span>
              </div>
              <h3 className="text-base font-heading font-bold text-[#312C29]">Principal Product Designer Retention</h3>
              <p className="text-xs text-[#5D5753] leading-relaxed">
                Synthesized verified L&D certification allowance and cross-functional leadership charter, decreasing flight probability from 68% down to 21%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Client & Leadership Testimonials (Noovotic's "Hear From Our Satisfied Clients") ── */}
      <section className="px-6 lg:px-12 py-20 bg-[#FAF6F2] border-y border-[#DED1C9]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">Executive Feedback</span>
            <h2 className="text-3xl font-heading font-bold text-[#312C29]">
              Trusted by People Operations & Engineering Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#312C29] leading-relaxed italic">
                "Nirnaya turned our quarterly attrition reviews from subjective guessing into mathematically rigorous, policy-backed conversations. We preserved our core backend leads during the scaling phase."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#DED1C9]">
                <img src={ASSETS.portraitWoman} alt="Chief People Officer" className="w-10 h-10 rounded-full object-cover filter grayscale" />
                <div>
                  <h4 className="text-xs font-heading font-bold text-[#312C29]">Ananya Deshmukh</h4>
                  <p className="text-[11px] text-[#7A736E]">Chief People Officer, CloudScale</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#312C29] leading-relaxed italic">
                "The SHAP explainability breakdown gives managers immediate clarity. It doesn't just say an engineer is at risk; it shows that overtime burden is the villain and recent promotion is protecting them."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#DED1C9]">
                <img src={ASSETS.portraitMan} alt="VP of Engineering" className="w-10 h-10 rounded-full object-cover filter grayscale" />
                <div>
                  <h4 className="text-xs font-heading font-bold text-[#312C29]">Rajiv Nair</h4>
                  <p className="text-[11px] text-[#7A736E]">VP of Engineering, Apex Systems</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#DED1C9] shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs text-[#312C29] leading-relaxed italic">
                "Having the RAG policy assistant immediately cite the exact handbook clause for compensation guardrails eliminates HR compliance risks during counter-offers."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#DED1C9]">
                <img src={ASSETS.portraitExecutive} alt="Director People Ops" className="w-10 h-10 rounded-full object-cover filter grayscale" />
                <div>
                  <h4 className="text-xs font-heading font-bold text-[#312C29]">Suresh Menon</h4>
                  <p className="text-[11px] text-[#7A736E]">Director of People Operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Conversion Call to Action Banner (Noovotic Style) ── */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="bg-[#312C29] text-[#FBF4EF] rounded-3xl p-8 sm:p-14 border border-[#1C1816] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle warm glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#D9684C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-2xl relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9684C]">
              Enterprise Readiness
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Ready to transform your workforce intelligence today?
            </h2>
            <p className="text-xs sm:text-sm text-[#FBF4EF]/85 leading-relaxed">
              Launch the live interactive demo or sign in to experience XGBoost flight risk modeling, SHAP explainability, and policy governance firsthand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
            <button
              onClick={() => handleQuickLaunch(ROLES.HR_STAFF, 'aditi_hr')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#D9684C] hover:bg-[#B2553E] text-white text-xs font-bold transition-all shadow-md active:scale-95 text-center"
            >
              Launch Live Workspace
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all text-center"
            >
              Sign In with Persona
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. Mega-Footer (Noovotic Clean Editorial Design) ── */}
      <footer className="bg-[#FAF6F2] border-t border-[#DED1C9] px-6 lg:px-12 py-16 text-xs text-[#7A736E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#312C29] text-[#D9684C] flex items-center justify-center font-heading font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-base text-[#312C29]">
                Nirnaya<span className="text-[#D9684C]">.ai</span>
              </span>
            </div>
            <p className="text-[11px] text-[#5D5753] leading-relaxed">
              AI-driven workforce intelligence platform. Explainable attrition prediction and verifiable policy governance for modern enterprises.
            </p>
            <div className="text-[10px] font-mono text-[#7A736E] pt-2">
              Team Curious Coders • DSCE Hackathon
            </div>
          </div>

          {/* Col 2: Platform Solutions */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#312C29]">Core Engines</h4>
            <ul className="space-y-1.5 text-[11px] text-[#5D5753]">
              <li><Link to="/dashboard" className="hover:text-[#D9684C]">XGBoost Risk Dashboard</Link></li>
              <li><Link to="/teams" className="hover:text-[#D9684C]">10 Department Rollups</Link></li>
              <li><Link to="/policy" className="hover:text-[#D9684C]">Policy Q&A Intelligence</Link></li>
              <li><Link to="/onboarding" className="hover:text-[#D9684C]">Employee Onboarding Studio</Link></li>
              <li><Link to="/admin/employees" className="hover:text-[#D9684C]">Enterprise Directory CRUD</Link></li>
            </ul>
          </div>

          {/* Col 3: Research & Stack */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#312C29]">AI Architecture</h4>
            <ul className="space-y-1.5 text-[11px] text-[#5D5753]">
              <li>FastAPI Async REST Backend</li>
              <li>XGBoost Classifier + SHAP Explainer</li>
              <li>ChromaDB Vector Embeddings</li>
              <li>Groq LLM Llama-3 Inference</li>
              <li>React + Tailwind CSS + Recharts</li>
            </ul>
          </div>

          {/* Col 4: Hackathon Details */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#312C29]">Institutional Host</h4>
            <p className="text-[11px] text-[#5D5753] leading-relaxed">
              Dayananda Sagar College of Engineering (DSCE), Bengaluru.<br />
              Theme: AI in Human Resources & Workforce Intelligence.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#A5D6A7]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"></span>
                Production Ready Build v1.0
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#DED1C9] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <span>© 2026 Nirnaya.ai. All rights reserved. Team Curious Coders.</span>
          <div className="flex items-center gap-4 text-[#7A736E]">
            <Link to="/policy" className="hover:text-[#312C29]">Governing Handbooks</Link>
            <span>•</span>
            <Link to="/login" className="hover:text-[#312C29]">Persona Portal</Link>
            <span>•</span>
            <a href="https://noovotic.webflow.io/" target="_blank" rel="noopener noreferrer" className="hover:text-[#312C29] flex items-center gap-1">
              <span>Design Reference (Noovotic)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
