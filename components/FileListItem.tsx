import React from 'react';
import { type ConversionFile, type SupportedFormat, FileStatus } from '../types';
import { SUPPORTED_FORMATS } from '../constants';
import { formatFileSize } from '../services/imageConverter';

interface FileListItemProps {
  file: ConversionFile;
  onFormatChange: (id: string, format: SupportedFormat) => void;
  onRemove: (id: string) => void;
}

const getStatusColor = (status: FileStatus) => {
    switch (status) {
        case FileStatus.DONE: return 'text-brand-primary dark:text-brand-primary';
        case FileStatus.CONVERTING: return 'text-brand-primary dark:text-brand-primary';
        case FileStatus.ERROR: return 'text-red-600 dark:text-red-400';
        default: return 'text-slate-500 dark:text-slate-400';
    }
}

const ProgressBar = ({ progress, status }: { progress: number; status: FileStatus }) => {
    let bgColor = 'bg-brand-primary';
    if (status === FileStatus.DONE) bgColor = 'bg-brand-primary';
    if (status === FileStatus.ERROR) bgColor = 'bg-red-600';

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div className={`${bgColor} h-1.5 rounded-full transition-all duration-300 ease-in-out`} style={{ width: `${progress}%` }}></div>
        </div>
    );
};

const DownloadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
  </svg>
);

const RemoveIcon: React.FC = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);


export const FileListItem: React.FC<FileListItemProps> = ({ file, onFormatChange, onRemove }) => {
  const isActionable = file.status === FileStatus.WAITING || file.status === FileStatus.ERROR;

  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-4 transition-all">
      <div className="flex-grow w-full">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text dark:text-white truncate">{file.originalFile.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formatFileSize(file.originalFile.size)}</p>
            </div>
            <div className="md:hidden ml-4 flex-shrink-0">
                <button onClick={() => onRemove(file.id)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-200 transition">
                    <RemoveIcon />
                </button>
            </div>
        </div>

        <div className="mt-2.5">
            <p className={`text-xs font-semibold uppercase tracking-wider ${getStatusColor(file.status)}`}>{file.status}</p>
            <ProgressBar progress={file.progress} status={file.status} />
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">To:</span>
          <select
            value={file.targetFormat}
            onChange={(e) => onFormatChange(file.id, e.target.value as SupportedFormat)}
            disabled={!isActionable}
            className="text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {SUPPORTED_FORMATS.map(format => (
              <option key={format} value={format}>{format}</option>
            ))}
          </select>
        </div>

        {file.status === FileStatus.DONE && file.convertedUrl && (
          <a
            href={file.convertedUrl}
            download={file.convertedFilename}
            className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-primary/90 transition-colors"
          >
            <DownloadIcon />
            Download
          </a>
        )}
        
        <div className="hidden md:block">
            <button onClick={() => onRemove(file.id)} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-200 transition">
                <RemoveIcon />
            </button>
        </div>
      </div>
    </div>
  );
};