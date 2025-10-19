import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700">
      <button onClick={onBack} className="mb-6 text-sm font-semibold text-brand-primary hover:underline">&larr; Back to Converter</button>
      <div className="space-y-4 text-brand-text dark:text-slate-300">
        <h1 className="text-3xl font-bold text-slate-500 dark:text-slate-400">Privacy Policy</h1>
        <p className="text-sm text-slate-500"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">Our Commitment to Your Privacy</h2>
        <p>Image Converter by Chiara Berti 13 ("we," "us," or "our") is fundamentally committed to protecting your privacy. This application is designed with privacy as a core principle. This Privacy Policy explains how we handle your information when you use our image conversion tool.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">The Most Important Thing: No Data Collection</h2>
        <p className="font-semibold text-lg">
            We do not collect, store, transmit, or share any of your personal data or your files.
        </p>
        <p>
            All image processing, including uploading, converting, resizing, and cropping, happens exclusively within your web browser on your own device ("client-side"). Your files are never uploaded to any server. They do not leave your computer.
        </p>

        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">Information We Don't Collect</h2>
        <p>To be perfectly clear, we do not collect:</p>
        <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Personal Information:</strong> We don't ask for your name, email address, or any other personal details.</li>
            <li><strong>Your Files:</strong> The images you select for conversion are processed locally and are never sent to us or any third party.</li>
            <li><strong>Usage Data:</strong> We do not track how you use the application. There are no analytics, tracking pixels, or cookies.</li>
            <li><strong>IP Addresses or Device Information:</strong> We do not log or store your IP address, browser type, operating system, or any other device-specific information.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">Cookies and Local Storage</h2>
        <p>This application does not use browser cookies for tracking or identification purposes. It may use your browser's local storage for essential application functionality (like remembering your preferred settings), but this data is stored on your device and is not accessible by us.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">Third-Party Services</h2>
        <p>This application is self-contained and does not integrate with any third-party services that would have access to your data.</p>
        
        <h2 className="text-2xl font-bold text-slate-500 dark:text-slate-400 pt-4">Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page. Since we do not collect your contact information, we encourage you to review this policy periodically.</p>
      </div>
    </div>
  );
};