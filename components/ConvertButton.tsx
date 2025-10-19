import React from 'react';
import { type ConversionFile, FileStatus } from '../types';

interface ConvertButtonProps {
    files: ConversionFile[];
    isConverting: boolean;
    onConvert: () => void;
    isCompleted: boolean;
    isZipping: boolean;
    onDownloadAll: () => void;
}

const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ArchiveIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
      <path d="M10 12h4"/>
    </svg>
  );


export const ConvertButton: React.FC<ConvertButtonProps> = ({ files, isConverting, onConvert, isCompleted, isZipping, onDownloadAll }) => {
    
    // CORREZIONE 2: Se tutte le conversioni sono completate, mostra il pulsante "Download All"
    // al posto del pulsante di conversione.
    if (isCompleted) {
        const hasDownloadableFiles = files.some(f => f.status === FileStatus.DONE);
        if (!hasDownloadableFiles) {
            return null; // Non mostrare nulla se non ci sono file da scaricare (es. tutti errori)
        }
        return (
            <div className="mt-8 text-center">
                <button
                    onClick={onDownloadAll}
                    disabled={isZipping}
                    className="inline-flex items-center justify-center w-full md:w-auto px-12 py-4 text-lg font-bold text-white rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 dark:disabled:bg-brand-primary/40 disabled:cursor-not-allowed"
                >
                    {isZipping ? <Spinner /> : <ArchiveIcon />}
                    {isZipping ? 'Zipping...' : 'Download All'}
                </button>
            </div>
        );
    }

    const filesToConvert = files.filter(f => f.status === FileStatus.WAITING || f.status === FileStatus.ERROR).length;

    const getButtonText = () => {
        if (isConverting) return "Converting...";
        if (filesToConvert > 0) return `Convert ${filesToConvert} File${filesToConvert > 1 ? 's' : ''}`;
        if (files.length > 0 && filesToConvert === 0) return "All Done!";
        return "Convert";
    };

    const isDisabled = filesToConvert === 0 || isConverting;
    const buttonClass = 'bg-brand-primary hover:bg-brand-primary/90 disabled:bg-brand-primary/50 dark:disabled:bg-brand-primary/40 disabled:cursor-not-allowed';

    return (
        <div className="mt-8 text-center">
            <button
                onClick={onConvert}
                disabled={isDisabled}
                className={`inline-flex items-center justify-center w-full md:w-auto px-12 py-4 text-lg font-bold text-white rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-800 ${buttonClass}`}
            >
                {isConverting && <Spinner />}
                {getButtonText()}
            </button>
        </div>
    );
};
