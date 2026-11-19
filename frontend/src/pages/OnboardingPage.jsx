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
  Wrench,
  RefreshCw
} from 'lucide-react';
import { api } from '../api/api';
import { useToast } from '../context/ToastContext';

const DEFAULT_SAMPLE_PROMPTS = [
  "Hi, I'm Rahul Sharma, joining as a Senior Software Engineer in the Engineering team.",
  "Hello, I am Priya Kapoor. My role will be Product Analyst in the Product department.",
  "I'm Vikram Malhotra, hired as Enterprise Account Executive in Sales."
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Welcome to Nirnaya.ai! I am your AI Onboarding Assistant. Please tell me a bit about yourself — your name, the role you're taking on, and which department you'll be joining. You can write naturally in free text!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingToDB, setSubmittingToDB] = useState(false);

  // Extracted profile state
  const [extractedProfile, setExtractedProfile] = useState({
    name: '',
    role: '',
    department: '',
    skills: ['Python', 'FastAPI', 'React']
  });
  const [isComplete, setIsComplete] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.sendOnboardingMessage(text, 'session-1', extractedProfile);

      // Merge newly extracted fields
      if (response.parsed) {
        const updated = {
          name: response.parsed.name || extractedProfile.name,
          role: response.parsed.role || extractedProfile.role,
          department: response.parsed.department || extractedProfile.department,
          skills: response.parsed.skills?.length > 0 ? response.parsed.skills : extractedProfile.skills
        };
        setExtractedProfile(updated);
        setIsComplete(Boolean(updated.name && updated.role && updated.department));
      }

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.reply || response.message || "I've processed your information. Please check the profile card on the right.",
        fallbackNotice: response.fallbackNotice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Onboarding chat error:', err);
      toast.error('Error contacting onboarding agent');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEmployee = async () => {
    if (!extractedProfile.name || !extractedProfile.role || !extractedProfile.department) {
      toast.warning('Please provide at least Name, Role, and Department before registering.');
      return;
    }

    setSubmittingToDB(true);
    try {
      const payload = {
        name: extractedProfile.name,
        role: extractedProfile.role,
        department: extractedProfile.department,
        tenure_months: 1,
        engagement_score: 3.5,
        time_since_promotion_months: 0,
        overtime_hours: 2.0,
        JobLevel: 1,
        WorkLifeBalance: 3,
        skills: extractedProfile.skills
      };

      const created = await api.createEmployee(payload);
      toast.success(`Successfully registered ${created.name} in workforce database!`);
      
      // Calculate initial risk
      try {
        await api.getEmployeeRisk(created.id);
      } catch (e) {
        // Continue even if ML model needs warm up
      }

      // Navigate to their new profile
      navigate(`/employees/${created.id}`);
    } catch (err) {
      console.error('Error creating employee:', err);
      toast.error('Failed to register employee: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmittingToDB(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Conversational Onboarding Agent</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              NLP Profile Extraction
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Employees or HR can describe incoming staff in plain English — our GenAI agent extracts structured data into the database.
          </p>
        </div>
      </div>

      {/* Main Grid: Chat on Left, Extracted Confirmation Card on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Left 2 Cols: Chat Window */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
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
                    {msg.fallbackNotice && (
                      <p className="mt-2 text-[10px] text-slate-400 italic">
                        {msg.fallbackNotice}
                      </p>
                    )}
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

            {loading && (
              <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in-50">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
                  <span>Agent is parsing profile details from your text...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Prompts */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Click sample statement to test:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  disabled={loading}
                  className="text-xs bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors truncate max-w-md"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="e.g. My name is Maya, joining Product as Senior UX Designer..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputText.trim()}
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-xs"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Extracted Structured Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Extracted Profile Card</span>
              </h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                isComplete
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {isComplete ? 'Ready to Add' : 'Awaiting Fields'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              As you chat, the AI extracts key profile attributes in real time. You can also manually adjust fields below.
            </p>

            {/* Structured Fields Form */}
            <div className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={extractedProfile.name}
                    onChange={(e) => setExtractedProfile({ ...extractedProfile, name: e.target.value })}
                    placeholder="Candidate full name"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Designated Role *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={extractedProfile.role}
                    onChange={(e) => setExtractedProfile({ ...extractedProfile, role: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Department *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={extractedProfile.department}
                    onChange={(e) => setExtractedProfile({ ...extractedProfile, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Skills Recognized
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 min-h-[44px]">
                  {extractedProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submission Action */}
          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleRegisterEmployee}
              disabled={submittingToDB || !extractedProfile.name || !extractedProfile.role || !extractedProfile.department}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all active:scale-[0.99]"
            >
              <span>{submittingToDB ? 'Registering into Database...' : 'Confirm & Add Employee'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Submits to <code className="font-mono text-slate-600">POST /employees</code> and triggers initial XGBoost risk baseline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
