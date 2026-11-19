import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  UserCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  ArrowRight,
  Briefcase,
  Building,
  UploadCloud,
  FileText,
  Plus,
  Trash2,
  Award,
  GraduationCap,
  FolderGit2,
  Target,
  Compass,
  Check,
  ChevronRight,
  ShieldCheck,
  Star,
  Layers,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { api } from '../api/api';
import { useToast } from '../context/ToastContext';

const DEPARTMENTS = ['Engineering', 'Sales', 'Product', 'Human Resources', 'Marketing'];

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const SKILL_CATEGORIES = [
  'Languages & Frameworks',
  'Cloud & DevOps',
  'Data & AI',
  'Design & Product',
  'Business & HR',
  'Core Non-Technical'
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Active View Mode: 'chat' or 'studio'
  const [activeTab, setActiveTab] = useState('studio');

  // Multi-step Stepper for Studio View
  const [currentStep, setCurrentStep] = useState(1);

  // Resume Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [pasteResumeOpen, setPasteResumeOpen] = useState(false);
  const [rawResumeText, setRawResumeText] = useState('');

  // Conversational Chat Messages
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Welcome to Nirnaya.ai's AI-Powered Workforce Onboarding! I can help you build a comprehensive profile.\n\nYou can chat with me, upload your resume (PDF/DOCX/TXT), or use the step-by-step Profile Studio to configure your skills, work experience, projects, and career aspirations.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [submittingToDB, setSubmittingToDB] = useState(false);

  // ── Comprehensive Dynamic Employee Profile State ──────────────────────────
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Bengaluru, India',
    role: '',
    department: 'Engineering',
    work_model: 'Hybrid (3 days office, 2 days remote)',
    JobLevel: 2,
    WorkLifeBalance: 3,
    engagement_score: 3.5,
    tenure_months: 1,
    overtime_hours: 0.0,
    skills: [
      { name: 'Python', category: 'Languages & Frameworks', proficiency: 'Advanced', years: 3, is_primary: true },
      { name: 'FastAPI', category: 'Languages & Frameworks', proficiency: 'Advanced', years: 2, is_primary: true },
      { name: 'React', category: 'Languages & Frameworks', proficiency: 'Intermediate', years: 2, is_primary: true },
      { name: 'Docker', category: 'Cloud & DevOps', proficiency: 'Intermediate', years: 2, is_primary: false },
      { name: 'PostgreSQL', category: 'Data & AI', proficiency: 'Advanced', years: 3, is_primary: false }
    ],
    education: [
      { degree: 'B.Tech in Computer Science', institution: 'Dayananda Sagar College of Engineering', year: '2023', field: 'Computer Science' }
    ],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2024', credId: 'AWS-99214-ARCH' }
    ],
    experience: [
      {
        company: 'CloudScale Technologies',
        role: 'Software Development Engineer',
        duration: '2023 - 2026',
        description: 'Engineered distributed microservices with FastAPI and PostgreSQL, serving 1M+ daily active requests.'
      }
    ],
    projects: [
      {
        title: 'Intelligent Enterprise Knowledge Engine',
        tech_stack: ['FastAPI', 'ChromaDB', 'React', 'Docker'],
        description: 'Developed RAG vector search tool indexing 50,000 internal documents with sub-100ms latency.'
      }
    ],
    responsibilities: [
      'Architect robust backend services and REST APIs with high test coverage',
      'Participate in sprint planning, architectural RFCs, and code review reviews',
      'Collaborate with Product and QA to ensure policy compliance and reliability'
    ],
    career_goals: {
      short_term: 'Master the Nirnaya system architecture and lead first production delivery within 60 days.',
      long_term: 'Advance towards Technical Lead with deep end-to-end distributed system ownership.',
      learning_preferences: ['Hands-on Cloud Architecture Projects', 'Cloud Certifications', '1-on-1 Mentorship']
    }
  });

  // AI Skill Gap & Onboarding Roadmap Analysis
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Dynamic Skill Input Modal / State
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Languages & Frameworks',
    proficiency: 'Intermediate',
    years: 2,
    is_primary: false
  });

  // Dynamic Project Input
  const [newProject, setNewProject] = useState({
    title: '',
    tech_stack: '',
    description: ''
  });

  // Dynamic Education Input
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: '2024'
  });

  // Dynamic Certification Input
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    year: '2024',
    credId: ''
  });

  // Dynamic Experience Input
  const [newExperience, setNewExperience] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  });

  const [newResponsibility, setNewResponsibility] = useState('');

  // Calculate Profile Completeness Percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.name) score += 20;
    if (profile.email) score += 10;
    if (profile.role) score += 20;
    if (profile.department) score += 10;
    if (profile.skills.length >= 3) score += 15;
    if (profile.experience.length >= 1) score += 10;
    if (profile.projects.length >= 1) score += 5;
    if (profile.education.length >= 1) score += 5;
    if (profile.career_goals.short_term) score += 5;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  // Run AI Analysis whenever profile role/department/skills change significantly
  const triggerAnalysis = async (customProfile = null) => {
    const target = customProfile || profile;
    setAnalysisLoading(true);
    try {
      const result = await api.analyzeProfile(target);
      setAnalysis(result);
    } catch (err) {
      console.warn('Fallback analysis used:', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    triggerAnalysis();
  }, [profile.role, profile.department, profile.skills.length]);

  // ── Handle Resume Upload ──────────────────────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    toast.info(`Extracting profile data from "${file.name}"...`);

    try {
      const result = await api.uploadResumeFile(file);
      if (result.profile) {
        setProfile((prev) => ({
          ...prev,
          ...result.profile,
          skills: result.profile.skills?.length > 0 ? result.profile.skills : prev.skills
        }));

        if (result.analysis) {
          setAnalysis(result.analysis);
        }

        toast.success(`Successfully parsed ${file.name}! Profile populated.`);
        // Switch to studio so user can inspect all sections
        setActiveTab('studio');
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('Could not parse resume: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Handle Raw Resume Text Parsing ────────────────────────────────────────
  const handleParseRawText = async () => {
    if (!rawResumeText.trim()) return;
    setIsUploading(true);
    try {
      const result = await api.parseResumeText(rawResumeText, profile);
      if (result.profile) {
        setProfile((prev) => ({
          ...prev,
          ...result.profile,
          skills: result.profile.skills?.length > 0 ? result.profile.skills : prev.skills
        }));
        if (result.analysis) {
          setAnalysis(result.analysis);
        }
        toast.success('Successfully extracted information from resume text!');
        setPasteResumeOpen(false);
        setRawResumeText('');
        setActiveTab('studio');
      }
    } catch (err) {
      toast.error('Failed to parse resume text: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  // ── Handle Chat Conversational Message ────────────────────────────────────
  const handleSendChatMessage = async () => {
    const text = inputText.trim();
    if (!text || chatLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setChatLoading(true);

    try {
      const response = await api.sendOnboardingMessage(text, 'session-1', profile);

      if (response.profile) {
        setProfile((prev) => ({
          ...prev,
          name: response.profile.name || prev.name,
          role: response.profile.role || prev.role,
          department: response.profile.department || prev.department,
          skills: response.profile.skills?.length > 0 ? response.profile.skills : prev.skills
        }));
      }

      if (response.analysis) {
        setAnalysis(response.analysis);
      }

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply || "Information recorded into your onboarding profile.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Onboarding assistant error');
    } finally {
      setChatLoading(false);
    }
  };

  // ── Dynamic Array Manipulators ────────────────────────────────────────────
  const addSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...newSkill, name: newSkill.name.trim() }]
    }));
    setNewSkill({ name: '', category: 'Languages & Frameworks', proficiency: 'Intermediate', years: 2, is_primary: false });
    toast.success(`Added skill: ${newSkill.name}`);
  };

  const removeSkill = (index) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addProject = (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const stack = newProject.tech_stack.split(',').map((s) => s.trim()).filter(Boolean);
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...newProject, tech_stack: stack }]
    }));
    setNewProject({ title: '', tech_stack: '', description: '' });
    toast.success('Project added!');
  };

  const removeProject = (index) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addEducation = (e) => {
    e.preventDefault();
    if (!newEducation.degree.trim()) return;
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { ...newEducation }]
    }));
    setNewEducation({ degree: '', institution: '', year: '2024' });
    toast.success('Education record added!');
  };

  const removeEducation = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addCertification = (e) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    setProfile((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { ...newCert }]
    }));
    setNewCert({ name: '', issuer: '', year: '2024', credId: '' });
    toast.success('Certification added!');
  };

  const removeCertification = (index) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addExperience = (e) => {
    e.preventDefault();
    if (!newExperience.company.trim()) return;
    setProfile((prev) => ({
      ...prev,
      experience: [...prev.experience, { ...newExperience }]
    }));
    setNewExperience({ company: '', role: '', duration: '', description: '' });
    toast.success('Work experience entry added!');
  };

  const removeExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addResponsibility = (e) => {
    e.preventDefault();
    if (!newResponsibility.trim()) return;
    setProfile((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, newResponsibility.trim()]
    }));
    setNewResponsibility('');
  };

  const removeResponsibility = (index) => {
    setProfile((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  // ── Submit & Register into Workforce Database ─────────────────────────────
  const handleFinalRegistration = async () => {
    if (!profile.name || !profile.role || !profile.department) {
      toast.warning('Name, Role, and Department are required to register.');
      setCurrentStep(1);
      return;
    }

    setSubmittingToDB(true);
    try {
      // Extract string skill names for ML risk model compatibility
      const skillNames = profile.skills.map((s) => (typeof s === 'string' ? s : s.name));

      const payload = {
        name: profile.name.trim(),
        role: profile.role.trim(),
        department: profile.department.trim(),
        tenure_months: profile.tenure_months || 1,
        engagement_score: profile.engagement_score || 3.5,
        time_since_promotion_months: 0,
        overtime_hours: profile.overtime_hours || 0.0,
        JobLevel: profile.JobLevel || 1,
        WorkLifeBalance: profile.WorkLifeBalance || 3,
        skills: skillNames,
        profile_details: {
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          work_model: profile.work_model,
          skills_detailed: profile.skills,
          education: profile.education,
          certifications: profile.certifications,
          experience: profile.experience,
          projects: profile.projects,
          responsibilities: profile.responsibilities,
          career_goals: profile.career_goals,
          onboarding_analysis: analysis
        }
      };

      const created = await api.createEmployee(payload);
      toast.success(`Successfully registered ${created.name} in database!`);

      // Compute initial XGBoost + SHAP risk score baseline
      try {
        await api.getEmployeeRisk(created.id);
      } catch (e) {
        // ignore
      }

      // Navigate directly to their newly created workforce profile
      navigate(`/employees/${created.id}`);
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Registration failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmittingToDB(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header & Progress Overview ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Enterprise Employee Onboarding Studio
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Extract profile attributes from resumes, configure multi-tiered skill sets, verify policy entitlements, and register complete candidate records into Nirnaya.ai.
          </p>
        </div>

        {/* Readiness Meter & Quick Registration Button */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Profile Readiness</div>
            <div className="text-xl font-extrabold font-mono text-brand-600">{completeness}% Complete</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200/60">
              <div
                className={`h-full transition-all duration-500 ${
                  completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-brand-600'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleFinalRegistration}
            disabled={submittingToDB || completeness < 40}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md shadow-brand-500/25 active:scale-95 flex items-center gap-2"
          >
            <span>{submittingToDB ? 'Registering...' : 'Complete & Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Mode Navigation Bar: Studio vs Conversational AI ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Dual Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'studio'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Profile Studio (Guided Flow)</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Conversational Agent</span>
          </button>
        </div>

        {/* Resume Ingestion Actions */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-brand-600" />
            <span>{isUploading ? 'Extracting...' : 'Upload Resume (PDF/DOCX)'}</span>
          </button>

          <button
            onClick={() => setPasteResumeOpen(!pasteResumeOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {/* ── Paste Raw Resume Modal / Dropdown ── */}
      {pasteResumeOpen && (
        <div className="bg-white rounded-2xl border border-brand-200 p-5 shadow-md space-y-3 animate-in fade-in-50">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Paste Resume or Candidate Summary for AI Extraction</span>
            </h4>
            <button
              onClick={() => setPasteResumeOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <textarea
            rows="4"
            value={rawResumeText}
            onChange={(e) => setRawResumeText(e.target.value)}
            placeholder="Paste raw resume paragraphs, LinkedIn profile summary, or candidate work history here..."
            className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <div className="flex justify-end">
            <button
              onClick={handleParseRawText}
              disabled={isUploading || !rawResumeText.trim()}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-xs"
            >
              {isUploading ? 'Analyzing with NLP...' : 'Extract & Fill Profile'}
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ── TAB 1: GUIDED PROFILE STUDIO (STEP-BY-STEP FLOW) ─────────────────── */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stepper Navigation Sidebar */}
          <div className="space-y-2">
            {[
              { num: 1, title: 'Personal & Role Baseline', desc: 'Identity, contacts & department', icon: User },
              { num: 2, title: 'Skills & Competency Matrix', desc: 'Proficiency & years experience', icon: Award },
              { num: 3, title: 'Work History & Projects', desc: 'Past experience & portfolio', icon: FolderGit2 },
              { num: 4, title: 'Education & Certifications', desc: 'Degrees & verified credentials', icon: GraduationCap },
              { num: 5, title: 'Responsibilities & Goals', desc: 'Scope, expertise & preferences', icon: Target },
              { num: 6, title: 'AI Ramp-Up & Policy Perks', desc: 'Gap analysis & 30-60-90 roadmap', icon: Sparkles }
            ].map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-white border-brand-500 shadow-sm ring-2 ring-brand-500/10'
                      : 'bg-white/60 border-slate-200/70 hover:bg-white text-slate-600'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isActive ? 'bg-brand-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className={`text-xs font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{step.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form Step Workspace (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* ── STEP 1: Personal & Role Baseline ── */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Personal & Professional Identity</h3>
                  <p className="text-xs text-slate-500">Provide legal full name, work communication details, and job grade level.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Candidate Legal Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Maya Krishnan"
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Designated Role / Job Title *</label>
                    <input
                      type="text"
                      required
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Department *</label>
                    <select
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Work Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      placeholder="e.g. maya.k@nirnaya.ai"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Telephone Contact</label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Base Office Location</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Bengaluru Tech Park, India"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Work Model (Hybrid Baseline)</label>
                    <select
                      value={profile.work_model}
                      onChange={(e) => setProfile({ ...profile, work_model: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value="Hybrid (3 days office, 2 days remote)">Hybrid (3 days office, 2 days remote - POL-OPS-002)</option>
                      <option value="Full-Time Remote (Approved Exception)">Full-Time Remote (Approved Exception)</option>
                      <option value="In-Office Dedicated">In-Office Dedicated</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Job Grade Level</label>
                    <select
                      value={profile.JobLevel}
                      onChange={(e) => setProfile({ ...profile, JobLevel: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option value={1}>Level 1: Associate / Junior Contributor</option>
                      <option value={2}>Level 2: Mid / Senior Individual Contributor</option>
                      <option value={3}>Level 3: Lead Engineer / Principal Contributor</option>
                      <option value={4}>Level 4: Staff / Director Level</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Skills & Competencies</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Skills & Competency Matrix ── */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Technical & Non-Technical Skill Matrix</h3>
                    <p className="text-xs text-slate-500">Add dynamic skills with proficiency rankings and years of experience.</p>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                    {profile.skills.length} Skills Catalogued
                  </span>
                </div>

                {/* Dynamic Skill Adder Form */}
                <form onSubmit={addSkill} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Add New Dynamic Skill</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      required
                      value={newSkill.name}
                      onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      placeholder="Skill name (e.g. Kubernetes, PyTorch, Leadership)"
                      className="sm:col-span-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />

                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={newSkill.proficiency}
                      onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    >
                      {PROFICIENCY_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={newSkill.years}
                        onChange={(e) => setNewSkill({ ...newSkill, years: parseInt(e.target.value, 10) || 0 })}
                        placeholder="Yrs"
                        className="w-16 px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                      <button
                        type="submit"
                        className="flex-1 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Interactive Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profile.skills.map((skill, idx) => {
                    const skillName = typeof skill === 'string' ? skill : skill.name;
                    const proficiency = skill.proficiency || 'Intermediate';
                    const years = skill.years ?? 2;
                    const category = skill.category || 'General';

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs flex flex-col justify-between gap-2 group hover:border-brand-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-xs text-slate-900 group-hover:text-brand-600 transition-colors">
                              {skillName}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{category}</span>
                          </div>
                          <button
                            onClick={() => removeSkill(idx)}
                            className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                            title="Remove Skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[10px]">
                            {proficiency}
                          </span>
                          <span className="font-mono text-slate-500 text-[10px]">{years} yrs exp</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Work & Projects</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Work History & Notable Projects ── */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Work Experience & Key Project Deliverables</h3>
                  <p className="text-xs text-slate-500">Record past employment milestones and technical architecture initiatives.</p>
                </div>

                {/* Work Experience Entries */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-brand-600" />
                      <span>Past Employment Experience ({profile.experience.length})</span>
                    </span>
                  </div>

                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 relative group">
                      <button
                        onClick={() => removeExperience(idx)}
                        className="absolute top-3 right-3 text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="font-bold text-xs text-slate-900">{exp.role} — {exp.company}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{exp.duration}</div>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}

                  {/* Add Experience Form */}
                  <form onSubmit={addExperience} className="p-4 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">+ Add Work Experience</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        placeholder="Company name"
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                      <input
                        type="text"
                        required
                        value={newExperience.role}
                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                        placeholder="Title / Role"
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                      <input
                        type="text"
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                        placeholder="Duration (e.g. 2022 - 2024)"
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <textarea
                      rows="2"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                      placeholder="Key achievements and team scope..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                    >
                      Add Experience Entry
                    </button>
                  </form>
                </div>

                {/* Notable Projects */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <FolderGit2 className="w-4 h-4 text-brand-600" />
                      <span>Notable Projects & Architectures ({profile.projects.length})</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs relative">
                        <button
                          onClick={() => removeProject(idx)}
                          className="absolute top-3 right-3 text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <h4 className="font-bold text-xs text-slate-900 pr-6">{proj.title}</h4>
                        <div className="flex flex-wrap gap-1 my-2">
                          {Array.isArray(proj.tech_stack) &&
                            proj.tech_stack.map((t, i) => (
                              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {t}
                              </span>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Project Form */}
                  <form onSubmit={addProject} className="p-4 rounded-2xl border border-dashed border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">+ Add Project Portfolio Item</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Project title"
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                      <input
                        type="text"
                        value={newProject.tech_stack}
                        onChange={(e) => setNewProject({ ...newProject, tech_stack: e.target.value })}
                        placeholder="Tech stack (comma-separated, e.g. Python, Docker, Redis)"
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                    <textarea
                      rows="2"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Architecture summary, system design patterns, or metrics achieved..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                    >
                      Add Project Entry
                    </button>
                  </form>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Education & Certifications</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Education & Certifications ── */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Education & Professional Certifications</h3>
                  <p className="text-xs text-slate-500">Document formal university education and industry credential badges.</p>
                </div>

                {/* Education Section */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-brand-600" />
                    <span>Academic Qualifications ({profile.education.length})</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 relative">
                        <button
                          onClick={() => removeEducation(idx)}
                          className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="font-bold text-xs text-slate-900">{edu.degree}</div>
                        <div className="text-[11px] text-slate-500">{edu.institution}</div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">Class of {edu.year}</div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={addEducation} className="p-3 rounded-xl border border-dashed border-slate-200 flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      placeholder="Degree (e.g. M.Tech Software Engineering)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      required
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      placeholder="University / Institute"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                      placeholder="Year"
                      className="w-20 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Certifications Section */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-brand-600" />
                    <span>Industry Certifications ({profile.certifications.length})</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {profile.certifications.map((cert, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 relative">
                        <button
                          onClick={() => removeCertification(idx)}
                          className="absolute top-2.5 right-2.5 text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="font-bold text-xs text-indigo-950">{cert.name}</div>
                        <div className="text-[11px] text-indigo-700">{cert.issuer} ({cert.year})</div>
                        {cert.credId && <div className="text-[10px] font-mono text-slate-400 mt-1">ID: {cert.credId}</div>}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={addCertification} className="p-3 rounded-xl border border-dashed border-slate-200 flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={newCert.name}
                      onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                      placeholder="Certification (e.g. CKA Kubernetes Administrator)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                      placeholder="Issuer (e.g. Linux Foundation)"
                      className="w-36 px-3 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      value={newCert.credId}
                      onChange={(e) => setNewCert({ ...newCert, credId: e.target.value })}
                      placeholder="Credential ID"
                      className="w-32 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Responsibilities & Goals</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Responsibilities & Career Aspirations ── */}
            {currentStep === 5 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900">Job Scope & Career Aspirations</h3>
                  <p className="text-xs text-slate-500">Define key technical expectations, 60-day onboarding goals, and learning tracks.</p>
                </div>

                {/* Core Responsibilities */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Core Technical & Functional Responsibilities
                  </span>
                  <div className="space-y-2">
                    {profile.responsibilities.map((resp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-700">
                        <span className="leading-relaxed">• {resp}</span>
                        <button
                          onClick={() => removeResponsibility(idx)}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={addResponsibility} className="flex gap-2">
                    <input
                      type="text"
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="Add a new responsibility or domain ownership requirement..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Career Goals */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Career Trajectory & Growth Expectations
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        60-Day Onboarding Target (Short-Term)
                      </label>
                      <textarea
                        rows="3"
                        value={profile.career_goals.short_term}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            career_goals: { ...profile.career_goals, short_term: e.target.value }
                          })
                        }
                        className="w-full p-3 text-xs rounded-xl border border-slate-200"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        1–2 Year Career Milestone (Long-Term)
                      </label>
                      <textarea
                        rows="3"
                        value={profile.career_goals.long_term}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            career_goals: { ...profile.career_goals, long_term: e.target.value }
                          })
                        }
                        className="w-full p-3 text-xs rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
                  >
                    <span>View AI Ramp-Up & Policy Analysis</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 6: AI Ramp-Up Roadmap & Policy Perks Analysis ── */}
            {currentStep === 6 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-600" />
                      <span>AI Skill Gap Analysis & 30-60-90 Day Roadmap</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Personalized ramp-up trajectory evaluated against official company policies and role expectations.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Readiness Score: {analysis?.readiness_score || 95}%
                  </span>
                </div>

                {/* Core Strengths & Growth Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Identified Strengths</span>
                    </span>
                    <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                      {analysis?.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      )) || <li>Strong foundation in primary technical disciplines</li>}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Target Growth Opportunities</span>
                    </span>
                    <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                      {analysis?.opportunities?.map((o, i) => (
                        <li key={i}>{o}</li>
                      )) || <li>Utilize annual L&D budget for cloud architecture leveling</li>}
                    </ul>
                  </div>
                </div>

                {/* 30-60-90 Day Roadmap */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Structured 30-60-90 Day Ramp-Up Milestones
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {analysis?.roadmap?.map((phase, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                          {phase.phase}
                        </div>
                        <div className="text-xs font-bold text-slate-800">{phase.focus}</div>
                        <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-200/70">
                          {phase.milestones.map((m, mi) => (
                            <li key={mi} className="flex items-start gap-1.5">
                              <span className="text-brand-500 font-bold">•</span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Policy Benefits Entitlements */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Policy Entitlements & Compliance</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysis?.policy_benefits?.map((benefit, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{benefit.title}</span>
                          <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {benefit.value}
                          </span>
                        </div>
                        <div className="text-[10px] text-brand-600 font-medium mt-0.5">{benefit.policy}</div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{benefit.details}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Register CTA */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Back to Goals
                  </button>
                  <button
                    onClick={handleFinalRegistration}
                    disabled={submittingToDB || completeness < 40}
                    className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-brand-500/25 active:scale-95 flex items-center gap-2"
                  >
                    <span>{submittingToDB ? 'Writing to PostgreSQL Database...' : 'Register Candidate in Workforce DB'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* ── TAB 2: AI CONVERSATIONAL AGENT CHAT ──────────────────────────────── */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="h-[650px] bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden animate-in fade-in-50">
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-brand-100 text-brand-700'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <div
                    className={`text-[10px] text-slate-400 px-1 ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in-50">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
                  <span>Onboarding agent is analyzing profile and updating attributes...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chat Input */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Tell me about your role, technical skills, or education..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={chatLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
