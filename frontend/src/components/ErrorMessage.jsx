import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the backend services.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-6 text-center shadow-sm max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3 text-rose-600">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">{title}</h3>
      <p className="text-sm text-rose-700/80 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-200"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
