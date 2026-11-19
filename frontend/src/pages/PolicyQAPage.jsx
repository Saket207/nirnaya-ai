import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  BookOpen,
  Sparkles,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Compass,
  Layers,
  X
} from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

const POLICY_SUGGESTIONS = [
  // ── Leave & Time Off (POL-HR-LEAVE-2026-V1) ──
  { category: 'Leave & PTO', question: 'How many days of paid annual leave do I get per year?' },
  { category: 'Leave & PTO', question: 'How many sick leaves can I take without a medical certificate?' },
  { category: 'Leave & PTO', question: 'Can I carry forward unused annual leave to the next year?' },
  { category: 'Leave & PTO', question: 'How many weeks of paid maternity leave are provided?' },
  { category: 'Leave & PTO', question: 'What is the entitlement and timeline for paternity leave?' },
  { category: 'Leave & PTO', question: 'How many days in advance must planned annual leave be submitted?' },

  // ── Remote & Hybrid (POL-OPS-002) ──
  { category: 'Remote & Hybrid', question: 'What is the hybrid baseline schedule and mandatory office presence?' },
  { category: 'Remote & Hybrid', question: 'Which days of the week are mandatory in-office anchor days?' },
  { category: 'Remote & Hybrid', question: 'What are the core working hours during remote work?' },
  { category: 'Remote & Hybrid', question: 'Who is eligible for full-time permanent remote work?' },
  { category: 'Remote & Hybrid', question: 'How much is the one-time home office equipment reimbursement?' },
  { category: 'Remote & Hybrid', question: 'What is the monthly internet and connectivity stipend?' },
  { category: 'Remote & Hybrid', question: 'What is the company policy on the Right to Disconnect?' },

  // ── Travel & Expenses (POL-FIN-EXP-2026-V1) ──
  { category: 'Travel & Expenses', question: 'What are the hotel lodging caps for Tier 1 metro cities?' },
  { category: 'Travel & Expenses', question: 'What is the daily meal per diem allowance during business travel?' },
  { category: 'Travel & Expenses', question: 'When is domestic air travel permitted and what flight class is allowed?' },
  { category: 'Travel & Expenses', question: 'Are personal laundry and mini-bar expenses reimbursable?' },
  { category: 'Travel & Expenses', question: 'How many days in advance must business travel be booked?' },
  { category: 'Travel & Expenses', question: 'Can alcohol be expensed under the individual meal per diem?' },

  // ── Learning & L&D (POL-FIN-EXP-2026-V1) ──
  { category: 'Learning & L&D', question: 'How much is the annual Professional Development (L&D) budget?' },
  { category: 'Learning & L&D', question: 'Which technical certifications are approved for reimbursement?' },
  { category: 'Learning & L&D', question: 'Does the L&D budget have a clawback provision if I resign?' },
  { category: 'Learning & L&D', question: "Can I use the L&D budget for Coursera, Udemy, or O'Reilly subscriptions?" },
  { category: 'Learning & L&D', question: 'What is the quarterly team morale and collaboration budget?' },

  // ── Promotion & Mobility (POL-HR-COC-2026-V4) ──
  { category: 'Promotion & Mobility', question: 'When do formal promotion cycles take place?' },
  { category: 'Promotion & Mobility', question: 'What is the stagnation review guardrail for engineers?' },
  { category: 'Promotion & Mobility', question: 'What is the maximum retention bonus for high flight risk employees?' },
  { category: 'Promotion & Mobility', question: 'What approvals are required for an exceptional 15% retention bonus?' },
  { category: 'Promotion & Mobility', question: 'What are the rules for internal job transfers and mobility?' },
  { category: 'Promotion & Mobility', question: 'What is the exploratory 15% Project-Swap program?' },

  // ── Ethics & Conduct (POL-HR-COC-2026-V4 & POL-OPS-002) ──
  { category: 'Ethics & Conduct', question: 'What is the company policy on moonlighting and outside employment?' },
  { category: 'Ethics & Conduct', question: 'Are personal open-source contributions permitted?' },
  { category: 'Ethics & Conduct', question: 'Can I connect to public Wi-Fi without the company VPN?' },
  { category: 'Ethics & Conduct', question: 'What is the zero-tolerance policy on workplace harassment?' },
  { category: 'Ethics & Conduct', question: 'What are the triggers, duration, and mentorship requirements for a PIP?' }
];

const CATEGORIES = [
  'All',
  'Leave & PTO',
  'Remote & Hybrid',
  'Travel & Expenses',
  'Learning & L&D',
  'Promotion & Mobility',
  'Ethics & Conduct'
];

const PolicyQAPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I am your Nirnaya.ai Policy Intelligence Assistant. Ask me any question regarding Acme Corp & Nirnaya Enterprise HR policies (Leave, Remote/WFH, Expenses & Travel, and Code of Conduct & Retention). Every answer is cross-checked against our official policy repository.",
      source: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggestions Interactive Drawer State
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [suggestionSearch, setSuggestionSearch] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText = null) => {
    const q = (questionText || inputQuestion).trim();
    if (!q || loading) return;

    // Add user question to messages
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const response = await api.askPolicyQuestion(q);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer || response.response || "No direct answer found in the policy database.",
        source: response.source || response.source_file || null,
        policyCode: response.policyCode || null,
        fallbackNotice: response.fallbackNotice || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Policy QA error:', err);
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "I encountered a difficulty querying the policy vector store. Please ensure the backend ChromaDB / Groq service is accessible.",
        source: 'Error connecting',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Filtered Suggestions based on Category and Search
  const filteredSuggestions = POLICY_SUGGESTIONS.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = !suggestionSearch || s.question.toLowerCase().includes(suggestionSearch.toLowerCase()) || s.category.toLowerCase().includes(suggestionSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Policy Q&A Intelligence</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified Citations
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            RAG Assistant powered by ChromaDB vector retrieval & Groq LLM with official document citations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>4 Policy Books • 35 Inquiries Indexed</span>
          </div>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden relative">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none shadow-xs'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Document Citation Chip */}
                  {msg.source && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-brand-600" />
                        Source:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${
                          msg.source === 'Not covered by policy'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {msg.source}
                      </span>
                      {msg.policyCode && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({msg.policyCode})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Fallback Notice if active */}
                  {msg.fallbackNotice && (
                    <div className="mt-1 text-[10px] text-slate-400 italic">
                      {msg.fallbackNotice}
                    </div>
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

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in-50">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-brand-600 animate-spin" />
                <span>Searching policy vector store & synthesizing verified answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Suggested Inquiries Section (Categorized & Expandable) ── */}
        <div className="bg-slate-50/90 border-t border-slate-200/90 transition-all duration-300">
          {/* Top bar with Toggle & Category Tabs */}
          <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>Suggested Inquiries ({filteredSuggestions.length})</span>
              </span>
              <span className="text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded-full">
                35 Verified Prompts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSuggestionsExpanded(!suggestionsExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-300 text-slate-700 transition-colors shadow-2xs"
              >
                <span>{suggestionsExpanded ? 'Collapse' : 'Explore All 35+ Topics'}</span>
                {suggestionsExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Drawer: Category Selector & Instant Search */}
          {suggestionsExpanded && (
            <div className="p-3 bg-white border-b border-slate-200 space-y-2.5 animate-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-brand-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Bar within Suggestions */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={suggestionSearch}
                    onChange={(e) => setSuggestionSearch(e.target.value)}
                    placeholder="Filter prompts..."
                    className="w-full pl-8 pr-2.5 py-1 text-[11px] rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  {suggestionSearch && (
                    <button
                      onClick={() => setSuggestionSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Suggestions List Grid */}
          <div
            className={`p-3 overflow-y-auto ${
              suggestionsExpanded ? 'max-h-56' : 'max-h-24'
            } transition-all`}
          >
            <div className="flex flex-wrap gap-1.5">
              {(suggestionsExpanded ? filteredSuggestions : filteredSuggestions.slice(0, 5)).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.question)}
                  disabled={loading}
                  className="text-xs bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-700 border border-slate-200/80 px-3 py-1.5 rounded-xl transition-all shadow-2xs text-left flex items-center gap-1.5 group"
                >
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-slate-100 group-hover:bg-brand-100/70 text-slate-500 group-hover:text-brand-700 rounded transition-colors">
                    {item.category}
                  </span>
                  <span>{item.question}</span>
                </button>
              ))}

              {!suggestionsExpanded && filteredSuggestions.length > 5 && (
                <button
                  onClick={() => setSuggestionsExpanded(true)}
                  className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold border border-brand-200 px-3 py-1.5 rounded-xl transition-colors"
                >
                  +{filteredSuggestions.length - 5} more inquiries...
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about leave, WFH equipment stipend, travel per diem, L&D budget, promotions, moonlighting..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputQuestion.trim()}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-xs active:scale-95"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyQAPage;
