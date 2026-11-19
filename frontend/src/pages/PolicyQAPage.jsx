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
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

const EXAMPLE_QUESTIONS = [
  "How many sick leaves do I get per year?",
  "What is the WFH equipment stipend and connectivity allowance?",
  "What are the promotion criteria and stagnation review guardrails?",
  "What are the hotel lodging caps and meal per diem for travel?"
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

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>4 Active Policy Books Indexed</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
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
                <span>Searching policy documents & synthesizing verified response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Example Clickable Prompts */}
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Suggested Inquiries:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_QUESTIONS.map((eq, i) => (
              <button
                key={i}
                onClick={() => handleSend(eq)}
                disabled={loading}
                className="text-xs bg-white hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs text-left"
              >
                {eq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about leave rules, WFH equipment stipend, travel expenses, code of conduct..."
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
