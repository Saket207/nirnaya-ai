import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-[#E8F5E9]/95 border-[#A5D6A7] text-[#2E7D32]'
                : t.type === 'error'
                ? 'bg-[#FFEBEE]/95 border-[#FFCDD2] text-[#C62828]'
                : t.type === 'warning'
                ? 'bg-[#FDEAE5]/95 border-[#D9684C]/40 text-[#B2553E]'
                : 'bg-white/95 border-[#DED1C9] text-[#312C29]'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#C62828]" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#D9684C]" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#D9684C]" />}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#7A736E] hover:text-[#312C29] p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
