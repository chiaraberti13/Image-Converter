import React from 'react';

interface FooterProps {
    onShowTerms: () => void;
    onShowPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowTerms, onShowPrivacy }) => {
  return (
    <footer className="w-full mt-16 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} Chiara Berti 13</p>
        <div className="mt-2 space-x-4">
          <a href="#" onClick={(e) => { e.preventDefault(); onShowTerms(); }} className="hover:text-brand-primary dark:hover:text-brand-primary">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onShowPrivacy(); }} className="hover:text-brand-primary dark:hover:text-brand-primary">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};