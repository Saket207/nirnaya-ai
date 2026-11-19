import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-[#FDEAE5] text-[#D9684C] flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-heading font-extrabold text-[#312C29] tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-heading font-semibold text-[#312C29] mb-2">Page Not Found</h2>
      <p className="text-xs text-[#5D5753] max-w-sm mb-6 leading-relaxed">
        The workspace route you are looking for does not exist or requires different role permissions.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#312C29] text-white font-semibold text-xs hover:bg-[#1C1816] transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
