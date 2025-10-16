import React from 'react';

const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary dark:text-brand-primary">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <LogoIcon />
            <span className="text-xl font-bold text-slate-500 dark:text-slate-400">Image Converter</span>
          </div>
        </div>
      </div>
    </header>
  );
};