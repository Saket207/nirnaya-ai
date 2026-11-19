import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  ExternalLink,
  Cpu,
  Compass,
  Briefcase,
  Zap,
  BarChart3,
  Server
} from 'lucide-react';
import { useAuth, ROLES } from '../context/AuthContext';

// High-resolution photography & monochrome assets from Noovotic CDN & platform
const ASSETS = {
  heroWorkspace: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c46a038c5276c46c28d8_three-colleagues-gathered-around-a-table-writing-n.webp',
  teamReview: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c7c42ec1a182b8ddb_two-colleagues-reviewing-a-tablet-by-a-large-windo.webp',
  meeting: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3deb309b2314ae7589e_man-presenting-to-colleagues-in-a-bright-meeting-r.webp',
  portraitWoman: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd8b371d14f8868b08_black-and-white-portrait-of-a-woman-with-wind-blow.webp',
  portraitMan: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3ddcabca94c5e665e7a_black-and-white-portrait-of-a-smiling-man-wearing-.webp',
  portraitExecutive: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c3dd1808a1d01d0fe115_black-and-white-portrait-of-a-young-man.webp',
  deskWork: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c41c59f40751e40a0ac3_smiling-professional-holding-a-folder-at-his-desk-.webp',
  
  // Noovotic 4-step process cards (monochrome geometric series)
  processObserve: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c444ebf366815a0e72c2_image-beeipbc4gh.webp',
  processQuantify: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c445a138eb77fd4be165_image-vz86l8e6yb.webp',
  processExplain: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c4440708bd3746e51c18_image-vnk3ehgfnf.webp',
  processIntervene: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c445336a25d5ef163f74_image-6pjrjfv3d4.webp',
  
  // Noovotic Creation of Adam Hands (Pointing inwards towards center CTA)
  handLeft: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c469aaee9a947f733e0f_hand-with-the-index-finger-pointing-to-the-right.webp',
  handRight: 'https://cdn.prod.website-files.com/6af4bf993221c7453b81c713/6af4c469aaee9a947f733e23_hand-with-the-index-finger-pointing-to-the-left.webp'
};

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();

  // Scroll Progress across entire page
  const [pageScrollProgress, setPageScrollProgress] = useState(0);

  // Michelangelo Hands Coming Together scroll progress [0 -> 1]
  const [handsProgress, setHandsProgress] = useState(0);
  const handsSectionRef = useRef(null);

  // 4-Step Process Carousel Track
  const processTrackRef = useRef(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [trackScrollPercent, setTrackScrollPercent] = useState(0);

  const handleQuickLaunch = (role, defaultUser) => {
    login(role, defaultUser);
    if (role === ROLES.EMPLOYEE) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  // 4-step process data matching Noovotic layout
  const processSteps = [
    {
      step: 'Step 1',
      number: '01',
      title: 'Observe',
      iconType: 'quad',
      description: 'We continuously capture telemetry across Okta SSO logins, overtime hours, and compa-ratios. Every weak signal counts.',
      badge: 'Okta & Workday Telemetry',
      image: ASSETS.processObserve,
      metric: '0.84 Retention R²'
    },
    {
      step: 'Step 2',
      number: '02',
      title: 'Quantify',
      iconType: 'star',
      description: 'We quantify calibrated attrition flight probabilities through gradient boosted trees, clustering workforce risk tiers.',
      badge: 'XGBoost Risk Classifier',
      image: ASSETS.processQuantify,
      metric: '84.2% ML Accuracy'
    },
    {
      step: 'Step 3',
      number: '03',
      title: 'Explain',
      iconType: 'hex',
      description: 'We mathematically isolate TreeSHAP attributions, distinguishing overtime burnout drivers from protective compensation signals.',
      badge: 'SHAP Attribution Engine',
      image: ASSETS.processExplain,
      metric: 'Game-Theoretic SHAP'
    },
    {
      step: 'Step 4',
      number: '04',
      title: 'Intervene',
      iconType: 'compass',
      description: 'We synthesize policy-verified retention playbooks cross-referenced with active company handbooks and compensation guidelines.',
      badge: 'ChromaDB & Groq RAG',
      image: ASSETS.processIntervene,
      metric: '<95ms Policy Audit'
    }
  ];

  // Track scroll position updates
  const updateTrackScrollState = () => {
    if (!processTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = processTrackRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    
    if (maxScroll > 0) {
      const pct = Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100));
      setTrackScrollPercent(pct);
      const stepIdx = Math.min(4, Math.round((scrollLeft / maxScroll) * 4));
      setActiveStepIndex(stepIdx);
    }
  };

  const scrollTrackToStep = (index) => {
    if (!processTrackRef.current) return;
    const cards = processTrackRef.current.children;
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      setActiveStepIndex(index);
    }
  };

  const scrollTrackDirection = (direction) => {
    if (!processTrackRef.current) return;
    const cardWidth = 460;
    const offset = direction === 'left' ? -cardWidth : cardWidth;
    processTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Scroll listener for Top Progress Bar and Hands Parallax
  useEffect(() => {
    const handleScroll = () => {
      // 1. Overall page progress
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocHeight > 0) {
        setPageScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalDocHeight) * 100)));
      }

      // 2. Hands Parallax Progress (Smooth reach towards center)
      if (handsSectionRef.current) {
        const rect = handsSectionRef.current.getBoundingClientRect();
        const windowH = window.innerHeight;
        
        // Progress goes 0 to 1 as section enters viewport towards center
        const start = windowH;
        const end = windowH * 0.25;
        const current = rect.top;
        
        const progress = Math.min(1, Math.max(0, (start - current) / (start - end)));
        setHandsProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF4EF] text-[#312C29] selection:bg-[#D9684C] selection:text-white font-sans">
      {/* ── 0. Top Reading Progress Indicator (Noovotic Terracotta Accent) ── */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#D9684C] z-[70] transition-[width] duration-150 ease-out"
        style={{ width: `${pageScrollProgress}%` }}
      />

      {/* ── 1. Top Navigation Bar (Noovotic Minimalist Header) ── */}
      <header className="sticky top-0 z-50 bg-[#FBF4EF]/95 backdrop-blur-md border-b border-[#DED1C9] px-6 lg:px-12 h-20 flex items-center justify-between transition-all">
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
          <a href="#process" className="hover:text-[#312C29] transition-colors">4-Step Process</a>
          <a href="#cases" className="hover:text-[#312C29] transition-colors">Evidence</a>
          <a href="#get-started" className="hover:text-[#312C29] transition-colors">Action Center</a>
          <a href="#governance" className="hover:text-[#312C29] transition-colors">Governance</a>
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

            {/* Founder & Research Charter Card */}
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
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A736E]">Live Telemetry</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full border border-[#A5D6A7]">
                    Low Risk (23%)
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#312C29]">Saket Kumar • Senior Backend Lead</div>
                  <div className="p-2.5 rounded-xl bg-[#FAF6F2] border border-[#DED1C9] text-[11px] text-[#5D5753] leading-relaxed">
                    <strong className="text-[#312C29]">SHAP Attribution:</strong> 0 hrs/wk overtime protects from burnout; 0 mos promotion lag indicates active leveling.
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

      {/* ── 5. EXACT NOOVOTIC 4-STEP PROCESS (Clean Natural Section with Butter-Smooth Carousel) ── */}
      {/* Zero empty voids, 100% visible, fully responsive, buttery-smooth horizontal navigation */}
      <section id="process" className="py-20 lg:py-24 bg-[#221D1A] text-white border-y border-[#312C29]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          {/* Header Row: Label, Title, Step Pills, and Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-[2px] bg-[#D9684C]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#D9684C]">
                  Our 4-Step Process
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight">
                A process that begins with common sense.
              </h2>
            </div>

            {/* Right Controls: Step Pills + Arrow Buttons + (06) badge */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 bg-white/5 p-1 rounded-full border border-white/10">
                {processSteps.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => scrollTrackToStep(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      activeStepIndex === idx
                        ? 'bg-[#D9684C] text-white shadow-xs'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {s.step}
                  </button>
                ))}
                <button
                  onClick={() => scrollTrackToStep(4)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeStepIndex === 4
                      ? 'bg-[#D9684C] text-white shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Action
                </button>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollTrackDirection('left')}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTrackDirection('right')}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-2xl sm:text-3xl font-heading font-light text-[#D9684C] tracking-tight pl-2">
                (06)
              </div>
            </div>
          </div>

          {/* Cards Track: Smooth Horizontal Scrolling Carousel with exact Noovotic dimensions */}
          <div
            ref={processTrackRef}
            onScroll={updateTrackScrollState}
            className="flex gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory focus:outline-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {processSteps.map((step, idx) => (
              <div
                key={step.step}
                className="w-[340px] sm:w-[440px] h-[358px] flex-shrink-0 snap-start bg-white rounded-3xl border border-[#DED1C9] shadow-xl text-[#312C29] grid grid-cols-[64px_1fr] overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Left Column: Vertical Step label and Terracotta Glyph */}
                <div className="border-r border-[#EFE7E1] flex flex-col justify-between items-center py-6 flex-shrink-0 bg-[#FAF6F2]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A736E] [writing-mode:vertical-lr] rotate-180">
                    {step.step}
                  </span>

                  {/* Terracotta glyph icons matching Noovotic */}
                  <div className="text-[#D9684C]">
                    {step.iconType === 'quad' && (
                      <div className="grid grid-cols-2 gap-1 w-4 h-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9684C]" />
                      </div>
                    )}
                    {step.iconType === 'star' && (
                      <div className="text-lg font-bold leading-none select-none">
                        ✱
                      </div>
                    )}
                    {step.iconType === 'hex' && (
                      <div className="text-lg font-bold leading-none select-none">
                        ✧
                      </div>
                    )}
                    {step.iconType === 'compass' && (
                      <div className="w-4 h-4 rounded-full border-2 border-[#D9684C] flex items-center justify-center">
                        <span className="w-1 h-1 bg-[#D9684C] rounded-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="p-6 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading font-bold text-[#312C29]">
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[#D9684C] font-semibold bg-[#FDEAE5] px-2 py-0.5 rounded-full">
                        {step.metric}
                      </span>
                    </div>
                    <p className="text-xs text-[#5D5753] leading-relaxed line-clamp-3">
                      {step.description}
                    </p>
                  </div>

                  {/* High-Resolution Monochrome Media (Noovotic 145px height) */}
                  <div className="h-[145px] rounded-2xl overflow-hidden border border-[#DED1C9] bg-[#FAF6F2]">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover filter contrast-[1.05] grayscale hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#7A736E] pt-2 border-t border-[#EFE7E1]">
                    <span className="font-semibold text-[#312C29]">{step.badge}</span>
                    <span className="text-[#D9684C] font-bold">0{idx + 1} / 04</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 5th Card: Terracotta CTA Card matching Noovotic */}
            <div className="w-[360px] sm:w-[480px] h-[358px] flex-shrink-0 snap-start bg-[#D9684C] rounded-3xl p-7 text-white flex flex-col justify-between shadow-2xl">
              <div className="space-y-3">
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white/80 bg-white/20 px-3 py-1 rounded-full">
                  Production Ready
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-white leading-tight">
                  Ready to deploy explainable workforce intelligence?
                </h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  Continuous telemetry, calibrated XGBoost attrition predictions, and policy-governed retention playbooks.
                </p>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => handleQuickLaunch(ROLES.HR_STAFF, 'aditi_hr')}
                  className="px-6 py-3 rounded-full bg-[#312C29] hover:bg-[#1C1816] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  Launch Platform
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
                >
                  Select Role
                </button>
              </div>
            </div>
          </div>

          {/* Clean bottom status bar with progress line */}
          <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D9684C] animate-pulse" />
              <span className="text-[11px]">Swipe or use controls to explore the 4-step workflow</span>
            </div>
            <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D9684C] transition-[width] duration-150"
                style={{ width: `${trackScrollPercent}%` }}
              />
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

      {/* ── 7. Client & Leadership Testimonials ── */}
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

      {/* ── 8. EXACT NOOVOTIC MICHELANGELO CREATION OF ADAM HANDS CTA ── */}
      {/* Hands moving inwards towards each other as user scrolls */}
      <section
        id="get-started"
        ref={handsSectionRef}
        className="relative px-6 lg:px-12 py-24 bg-[#FAF6F2] border-b border-[#DED1C9] overflow-hidden min-h-[520px] lg:min-h-[560px] flex items-center justify-center"
      >
        {/* Subtle spherical wireframe background pattern from Noovotic */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <svg
            className="w-[1000px] h-[600px] max-w-none text-[#DED1C9]"
            viewBox="0 0 1000 600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <ellipse cx="500" cy="300" rx="460" ry="260" strokeDasharray="3 3" />
            <ellipse cx="500" cy="300" rx="340" ry="260" />
            <ellipse cx="500" cy="300" rx="200" ry="260" strokeDasharray="2 2" />
            <line x1="500" y1="40" x2="500" y2="560" stroke="#D9684C" strokeWidth="1.5" />
            <circle cx="500" cy="230" r="4" fill="#D9684C" />
          </svg>
        </div>

        {/* Left Hand: Points to the right, moves inwards as user scrolls into view */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ease-out z-10 w-[280px] sm:w-[420px] lg:w-[540px]"
          style={{
            transform: `translate3d(${(1 - handsProgress) * -160}px, -50%, 0)`
          }}
        >
          <img
            src={ASSETS.handLeft}
            alt="Hand reaching from left"
            className="w-full object-contain filter grayscale contrast-[1.05] drop-shadow-md"
          />
        </div>

        {/* Right Hand: Points to the left, moves inwards as user scrolls into view */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ease-out z-10 w-[280px] sm:w-[420px] lg:w-[540px]"
          style={{
            transform: `translate3d(${(1 - handsProgress) * 160}px, -50%, 0)`
          }}
        >
          <img
            src={ASSETS.handRight}
            alt="Hand reaching from right"
            className="w-full object-contain filter grayscale contrast-[1.05] drop-shadow-md"
          />
        </div>

        {/* Center Content: Exact typography & CTA from Noovotic screenshot 2 */}
        <div className="relative z-20 text-center max-w-xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#D9684C] mb-2 animate-ping" />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-[#312C29] tracking-tight leading-[1.12]">
            Get started with Nirnaya today
          </h2>

          <p className="text-xs sm:text-sm text-[#5D5753] leading-relaxed max-w-md mx-auto">
            Bridge empirical attendance telemetry, explainable attrition algorithms, and verified corporate policy into one unified workspace.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Primary Noovotic Dark Button with Glowing Dot */}
            <button
              onClick={() => handleQuickLaunch(ROLES.HR_STAFF, 'aditi_hr')}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#312C29] hover:bg-[#1C1816] text-white text-xs font-bold tracking-wider uppercase shadow-xl transition-all active:scale-95 group"
            >
              <span className="w-2 h-2 rounded-full bg-[#D9684C] group-hover:scale-125 transition-transform" />
              <span>Launch Live Workspace</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white hover:bg-[#F2EAE3] text-[#312C29] text-xs font-bold tracking-wider uppercase border border-[#DED1C9] transition-all shadow-xs"
            >
              <span>Select Persona</span>
            </button>
          </div>

          <p className="text-[10px] text-[#7A736E] font-mono pt-2">
            Instant Demo • No Setup Required • DSCE Hackathon 2026
          </p>
        </div>
      </section>

      {/* ── 9. Mega-Footer (Noovotic Clean Editorial Design) ── */}
      <footer id="governance" className="bg-[#FAF6F2] border-t border-[#DED1C9] px-6 lg:px-12 py-16 text-xs text-[#7A736E]">
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
