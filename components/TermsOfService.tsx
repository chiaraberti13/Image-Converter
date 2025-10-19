import React from 'react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700">
      <button onClick={onBack} className="mb-6 text-sm font-semibold text-brand-primary hover:underline">&larr; Back to Converter</button>
      <div className="space-y-4 text-brand-text dark:text-slate-300">
        <h1 className="text-3xl font-bold text-slate-500 dark:text-slate-400">Terms of Service</h1>
        <p className="text-sm text-slate-500"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the Image Converter by Chiara Berti 13 (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">2. Description of Service</h2>
        <p>The Service is a client-side image conversion tool that allows users to convert, resize, and edit image files. All processing is performed locally on the user's device. No files or data are uploaded to or stored on our servers.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">3. User Responsibilities</h2>
        <p>You are solely responsible for the content (images) that you process through the Service. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and to authorize the Service to use all patent, trademark, trade secret, copyright, or other proprietary rights in and to any and all content you process.</p>
        <p>You agree not to use the Service to process any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">4. Disclaimer of Warranties</h2>
        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We provide no warranties, express or implied, regarding the service's reliability, accuracy, or availability. We do not warrant that the results of the use of the service will be correct, reliable, or will meet your requirements.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">5. Limitation of Liability</h2>
        <p>In no event shall Image Converter by Chiara Berti 13, nor its creators, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">6. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
      </div>
    </div>
  );
};