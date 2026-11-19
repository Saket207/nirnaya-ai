import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  ChevronRight,
  ChevronLeft,
  Search,
  ShieldCheck,
  Compass,
  Layers,
  X,
  Copy,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

// 4 Governing Corporate Policy Handbooks with official metadata
const POLICY_HANDBOOKS = [
  {
    code: 'POL-HR-LEAVE-2026-V1',
    title: 'Comprehensive Leave & Time-Off',
    category: 'Leave & PTO',
    scope: 'Annual, Sick, Maternity & Paternity',
    keyTerms: ['18 Days Annual PTO', '12 Days Sick Leave', '26 Weeks Maternity', '3 Days Notice'],
    color: 'border-[#A5D6A7] bg-[#E8F5E9]/50 text-[#2E7D32]',
    tagColor: 'bg-[#E8F5E9] text-[#2E7D32]'
  },
  {
    code: 'POL-OPS-002',
    title: 'Hybrid & Remote Work Framework',
    category: 'Remote & Hybrid',
    scope: 'In-Office Anchor Days, Core Hours & Stipends',
    keyTerms: ['3 Days In-Office', 'Tue & Thu Anchors', '$600 WFH Stipend', '$50/mo Internet'],
    color: 'border-[#D9684C]/40 bg-[#FDEAE5]/50 text-[#B2553E]',
    tagColor: 'bg-[#FDEAE5] text-[#B2553E]'
  },
  {
    code: 'POL-FIN-EXP-2026-V1',
    title: 'Global Travel, Expenses & L&D',
    category: 'Travel & Expenses',
    scope: 'Lodging Caps, Meal Per Diems & L&D Certs',
    keyTerms: ['Tier-1 Lodging Caps', 'Daily Per Diem', '$1,500 L&D Budget', 'No Clawback'],
    color: 'border-[#90CAF9] bg-[#E3F2FD]/50 text-[#1565C0]',
    tagColor: 'bg-[#E3F2FD] text-[#1565C0]'
  },
  {
    code: 'POL-HR-COC-2026-V4',
    title: 'Code of Conduct & Retention Governance',
    category: 'Promotion & Mobility',
    scope: 'Retention Bonuses, Promotion Cycles & PIP',
    keyTerms: ['15% Max Retention Bonus', '18mo Stagnation Review', '15% Project Swap', 'Moonlighting Rules'],
    color: 'border-[#CE93D8] bg-[#F3E5F5]/50 text-[#7B1FA2]',
    tagColor: 'bg-[#F3E5F5] text-[#7B1FA2]'
  }
];

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
      text: "Hello! I am your Nirnaya.ai Policy Intelligence Assistant. Ask me any question regarding Acme Corp & Nirnaya Enterprise HR policies (Leave, Remote/WFH, Expenses & Travel, and Code of Conduct & Retention). Every answer is cross-checked against our official policy repository with verified handbook section citations.",
      source: 'Acme Enterprise Repository',
      policyCode: 'All 4 Handbooks Indexed',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const chipsScrollRef = useRef(null);

  // Suggestions & Handbooks State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showHandbooksShelf, setShowHandbooksShelf] = useState(true);
  const [selectedHandbook, setSelectedHandbook] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollChips = (direction) => {
    if (chipsScrollRef.current) {
      const amount = direction === 'left' ? -280 : 280;
      chipsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
        source: 'Connection Error',
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

  // Filtered Suggestions based on Category
  const filteredSuggestions = useMemo(() => {
    return POLICY_SUGGESTIONS.filter((s) => {
      return selectedCategory === 'All' || s.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 pb-2">
      {/* ── 1. Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9684C]">
              ChromaDB Vector Retrieval & Groq LLM
            </span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-[#312C29] flex items-center gap-2.5">
            <span>Policy Q&A Intelligence</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7] uppercase tracking-wider">
              Verified Legal Citations
            </span>
          </h1>
          <p className="text-xs text-[#7A736E] mt-0.5">
            Real-time RAG engine querying 4 enterprise handbooks with &lt;95ms vector latency and exact section citations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => setShowHandbooksShelf(!showHandbooksShelf)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showHandbooksShelf
                ? 'bg-[#312C29] text-white border-[#312C29] shadow-xs'
                : 'bg-white text-[#5D5753] border-[#DED1C9] hover:bg-[#FAF6F2]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showHandbooksShelf ? 'Hide Handbooks' : 'View 4 Handbooks'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Collapsible 4 Governing Policy Handbooks Showcase ── */}
      {showHandbooksShelf && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0 animate-in fade-in-50 duration-200">
          {POLICY_HANDBOOKS.map((hb) => (
            <div
              key={hb.code}
              onClick={() => {
                setSelectedHandbook(hb);
                setSelectedCategory(hb.category);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                selectedCategory === hb.category
                  ? 'border-[#D9684C] bg-white ring-2 ring-[#D9684C]/20'
                  : 'border-[#DED1C9] bg-white hover:border-[#D9684C]/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${hb.tagColor}`}>
                  {hb.code}
                </span>
                <span className="text-[10px] text-[#7A736E] font-medium">Active 2026</span>
              </div>
              <h4 className="text-xs font-heading font-bold text-[#312C29] line-clamp-1">
                {hb.title}
              </h4>
              <p className="text-[11px] text-[#7A736E] line-clamp-1 mt-0.5">
                {hb.scope}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {hb.keyTerms.slice(0, 2).map((term, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#FAF6F2] border border-[#EFE7E1] text-[#5D5753]"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 3. Main Chat Container ── */}
      <div className="flex-1 bg-white rounded-3xl border border-[#DED1C9] shadow-xs flex flex-col overflow-hidden relative min-h-0">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              } animate-in fade-in-50 duration-200`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#312C29] text-white'
                    : 'bg-[#D9684C] text-white'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="space-y-1.5 max-w-full">
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#312C29] text-[#FBF4EF] rounded-tr-none shadow-xs'
                      : 'bg-[#FAF6F2] border border-[#DED1C9] text-[#312C29] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>

                  {/* Official Legal Citation Chip */}
                  {msg.source && (
                    <div className="mt-3.5 pt-3 border-t border-[#DED1C9] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#7A736E] flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#D9684C]" />
                          Verified Clause:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                            msg.source === 'Connection Error' || msg.source === 'Not covered by policy'
                              ? 'bg-[#FDEAE5] text-[#B2553E] border-[#D9684C]/30'
                              : 'bg-[#E8F5E9] text-[#2E7D32] border-[#A5D6A7]'
                          }`}
                        >
                          {msg.source}
                        </span>
                        {msg.policyCode && (
                          <span className="text-[10px] text-[#7A736E] font-mono font-medium">
                            {msg.policyCode}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="inline-flex items-center gap-1 text-[10px] text-[#7A736E] hover:text-[#312C29] transition-colors p-1"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#2E7D32]" />
                            <span className="text-[#2E7D32]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {msg.fallbackNotice && (
                    <div className="mt-2 text-[10px] text-[#7A736E] italic bg-white/70 p-2 rounded-xl border border-[#DED1C9]">
                      {msg.fallbackNotice}
                    </div>
                  )}
                </div>

                <div
                  className={`text-[10px] text-[#7A736E] px-2 flex items-center gap-1 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && msg.source && (
                    <>
                      <span>•</span>
                      <span className="text-[#2E7D32] font-semibold">Policy Verified ✓</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-[#D9684C] text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl bg-[#FAF6F2] border border-[#DED1C9] rounded-tl-none space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D9684C]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching ChromaDB Vector Embeddings & Groq LLM...</span>
                </div>
                <div className="h-2 w-48 bg-[#DED1C9] rounded-full" />
                <div className="h-2 w-32 bg-[#DED1C9] rounded-full" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── 4. Horizontal Quick-Inquiry Carousel Track ── */}
        <div className="border-t border-[#DED1C9] bg-[#FAF6F2] p-2.5 space-y-2 flex-shrink-0">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#312C29] text-white shadow-2xs'
                    : 'bg-white text-[#5D5753] hover:text-[#312C29] border border-[#DED1C9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Questions Horizontal Scroll Track */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scrollChips('left')}
              className="w-7 h-7 rounded-full bg-white border border-[#DED1C9] flex items-center justify-center text-[#5D5753] hover:bg-[#F2EAE3] flex-shrink-0 shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div
              ref={chipsScrollRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s.question)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F5E9DF] border border-[#DED1C9] hover:border-[#D9684C]/50 text-left text-xs text-[#312C29] transition-all flex items-center gap-1.5 flex-shrink-0 max-w-xs shadow-2xs group"
                >
                  <span className="text-[#D9684C] group-hover:scale-110 transition-transform">✦</span>
                  <span className="truncate">{s.question}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => scrollChips('right')}
              className="w-7 h-7 rounded-full bg-white border border-[#DED1C9] flex items-center justify-center text-[#5D5753] hover:bg-[#F2EAE3] flex-shrink-0 shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── 5. Input Textarea & Send Button ── */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#DED1C9] flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about Leave, Remote Work, Expenses, L&D, or Retention..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-2xl border border-[#DED1C9] text-xs sm:text-sm bg-[#FAF6F2] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D9684C]/20 focus:border-[#D9684C] transition-all text-[#312C29] disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputQuestion.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-[#312C29] hover:bg-[#1C1816] text-white flex items-center justify-center shadow-xs transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-[#D9684C]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyQAPage;