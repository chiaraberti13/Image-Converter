import React, { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
      <path d="M12 12v9"/>
      <path d="m16 16-4-4-4 4"/>
    </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const dragClasses = isDragging 
    ? 'border-brand-primary bg-brand-primary/10 dark:bg-slate-700/50' 
    : 'border-slate-300 dark:border-slate-600 hover:border-brand-primary';

  return (
    <div className="flex flex-col items-center">
        <label
            htmlFor="file-upload"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`w-full p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${dragClasses}`}
        >
            <UploadIcon />
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                Drag & drop files here or <span className="text-brand-primary dark:text-brand-primary">browse</span>
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Supports JPG, PNG, WEBP, GIF, BMP, TIFF, and HEIC files.</p>
            <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff,.heic,.heif"
                onChange={handleFileChange}
            />
        </label>
        <button 
            type="button"
            onClick={onButtonClick}
            className="mt-6 px-8 py-3 text-base font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-slate-900 transition-all"
        >
            Choose Files
        </button>
    </div>
  );
};