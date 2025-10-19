import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { FileListItem } from './components/FileListItem';
import { Footer } from './components/Footer';
import { ConvertButton } from './components/ConvertButton';
import { type ConversionFile, FileStatus, type SupportedFormat, type ResizeOptions, type CropOptions } from './types';
import { convertImage } from './services/imageConverter';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from './constants';
import { ConversionOptions, type NamingConvention } from './components/ConversionOptions';
import { BulkFormatSelector } from './components/BulkFormatSelector';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';

const ArchiveIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <rect width="20" height="5" x="2" y="3" rx="1"/>
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
    <path d="M10 12h4"/>
  </svg>
);

const App: React.FC = () => {
  const [files, setFiles] = useState<ConversionFile[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [namingConvention, setNamingConvention] = useState<NamingConvention>({
    type: 'suffix',
    suffix: '_converted',
    prefix: 'converted_',
  });
  const [compressionLevel, setCompressionLevel] = useState<number>(92); // 0-100
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    enabled: false,
    width: null,
    height: null,
  });
  const [cropOptions, setCropOptions] = useState<CropOptions>({
    enabled: false,
    aspectRatio: null,
  });
  const [currentPage, setCurrentPage] = useState<'main' | 'terms' | 'privacy'>('main');


  const handleFilesSelected = useCallback((selectedFiles: FileList) => {
    const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif'];
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.heic', '.heif'];

    const newFiles: ConversionFile[] = Array.from(selectedFiles)
      .filter(file => {
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
        const isSupported = supportedMimeTypes.includes(file.type.toLowerCase()) || supportedExtensions.includes(fileExtension);

        if (!isSupported) {
          alert(`File "${file.name}" is not a supported image type and will be skipped.`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`File "${file.name}" is too large (max ${MAX_FILE_SIZE_MB}MB) and will be skipped.`);
          return false;
        }
        return true;
      })
      .map(file => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        originalFile: file,
        targetFormat: 'PNG',
        status: FileStatus.WAITING,
        progress: 0,
      }));

    setFiles(prevFiles => {
      const uniqueNewFiles = newFiles.filter(nf => !prevFiles.some(pf => pf.id === nf.id));
      return [...prevFiles, ...uniqueNewFiles];
    });
  }, []);

  const updateFileFormat = (id: string, format: SupportedFormat) => {
    setFiles(files.map(f => f.id === id ? { ...f, targetFormat: format } : f));
  };

  const handleGlobalFormatChange = (format: SupportedFormat) => {
    if (!format) return;
    setFiles(prevFiles => 
        prevFiles.map(file => ({ ...file, targetFormat: format }))
    );
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const clearAll = () => {
    setFiles([]);
  }

  const generateFilename = (originalName: string, targetFormat: SupportedFormat) => {
    const nameWithoutExtension = originalName.split('.').slice(0, -1).join('.') || originalName;
    
    // CORREZIONE 3: Preserva l'estensione .tif o .tiff in base al file originale
    let extension = targetFormat.toLowerCase();
    if (targetFormat === 'TIFF') {
      const originalExtension = originalName.split('.').pop()?.toLowerCase();
      if (originalExtension === 'tif') {
        extension = 'tif';
      } else {
        // Per input .tiff o qualsiasi altro formato (es. .png), l'output di default è .tiff
        extension = 'tiff';
      }
    }
    
    switch (namingConvention.type) {
      case 'prefix':
        return `${namingConvention.prefix}${nameWithoutExtension}.${extension}`;
      case 'suffix':
        return `${nameWithoutExtension}${namingConvention.suffix}.${extension}`;
      case 'preserve':
      default:
        return `${nameWithoutExtension}.${extension}`;
    }
  };

  const handleConvert = async () => {
    setIsConverting(true);

    // CORREZIONE 1: Il filtro rimane semplice. La logica di conversione viene corretta in imageConverter.ts
    // per gestire correttamente tutti i file in attesa o con errori.
    const filesToProcess = files.filter(file => file.status === FileStatus.WAITING || file.status === FileStatus.ERROR);

    const conversionPromises = filesToProcess.map(async (file) => {
        setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: FileStatus.CONVERTING, progress: 0 } : f));
        
        try {
            const onProgress = (progress: number) => {
                setFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress } : f));
            };

            const result = await convertImage(file.originalFile, file.targetFormat, compressionLevel / 100, onProgress, resizeOptions, cropOptions);
            const newFilename = generateFilename(file.originalFile.name, file.targetFormat);

            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: FileStatus.DONE, convertedUrl: result.url, convertedSize: result.size, convertedFilename: newFilename, progress: 100 } : f));
        } catch (error) {
            console.error(`Error converting ${file.originalFile.name}:`, error);
            setFiles(prev => prev.map(f => f.id === file.id ? { ...f, status: FileStatus.ERROR, progress: 0 } : f));
        }
    });

    await Promise.all(conversionPromises);
    setIsConverting(false);
  };
  
  const handleDownloadAll = async () => {
    const filesToDownload = files.filter(f => f.status === FileStatus.DONE && f.convertedUrl);
    if (filesToDownload.length === 0) return;

    setIsZipping(true);
    const zip = new JSZip();

    try {
        const filePromises = filesToDownload.map(async (file) => {
            const response = await fetch(file.convertedUrl!);
            const blob = await response.blob();
            zip.file(file.convertedFilename!, blob);
        });

        await Promise.all(filePromises);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'converted-images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error creating zip file:", error);
        alert("An error occurred while creating the zip file. Please try downloading files individually.");
    } finally {
        setIsZipping(false);
    }
  };

  const hasDownloadableFiles = files.some(f => f.status === FileStatus.DONE);
  const isCompleted = files.length > 0 && files.every(f => f.status === FileStatus.DONE || f.status === FileStatus.ERROR);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 dark:text-slate-200">
      <Header onLogoClick={() => setCurrentPage('main')} />
      <main className="flex-grow w-full max-w-5xl mx-auto p-4 md:p-8">
        {currentPage === 'main' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-500 dark:text-slate-400 mb-2">Image Converter</h1>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Convert images online, securely and for free. Your files never leave your device.</p>
            
            <FileUpload onFilesSelected={handleFilesSelected} />

            {files.length > 0 && (
              <div className="mt-10">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Conversion Queue</h2>
                  <div className="flex items-center flex-wrap gap-4">
                    <BulkFormatSelector onFormatChange={handleGlobalFormatChange} />
                    {hasDownloadableFiles && (
                      <button
                        onClick={handleDownloadAll}
                        disabled={isZipping || isConverting}
                        className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArchiveIcon />
                        {isZipping ? 'Zipping...' : 'Download All'}
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="text-sm font-medium text-slate-600 hover:text-brand-primary dark:text-slate-300 dark:hover:text-brand-primary transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {files.map(file => (
                    <FileListItem 
                      key={file.id} 
                      file={file} 
                      onFormatChange={updateFileFormat} 
                      onRemove={removeFile} 
                    />
                  ))}
                </div>
                <ConversionOptions 
                  namingConvention={namingConvention}
                  onNamingConventionChange={setNamingConvention}
                  compressionLevel={compressionLevel}
                  onCompressionLevelChange={setCompressionLevel}
                  resizeOptions={resizeOptions}
                  onResizeOptionsChange={setResizeOptions}
                  cropOptions={cropOptions}
                  onCropOptionsChange={setCropOptions}
                />
                <ConvertButton 
                  files={files}
                  isConverting={isConverting}
                  onConvert={handleConvert}
                  isCompleted={isCompleted}
                  isZipping={isZipping}
                  onDownloadAll={handleDownloadAll}
                />
              </div>
            )}
          </div>
        )}
        {currentPage === 'terms' && <TermsOfService onBack={() => setCurrentPage('main')} />}
        {currentPage === 'privacy' && <PrivacyPolicy onBack={() => setCurrentPage('main')} />}
      </main>
      <Footer 
        onShowTerms={() => setCurrentPage('terms')}
        onShowPrivacy={() => setCurrentPage('privacy')}
      />
    </div>
  );
};

export default App;