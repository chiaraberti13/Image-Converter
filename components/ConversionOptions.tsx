import React from 'react';
import type { ResizeOptions, CropOptions, AspectRatio } from '../types';

export interface NamingConvention {
  type: 'preserve' | 'suffix' | 'prefix';
  suffix: string;
  prefix: string;
}

interface ConversionOptionsProps {
  namingConvention: NamingConvention;
  onNamingConventionChange: (convention: NamingConvention) => void;
  compressionLevel: number; // 0-100
  onCompressionLevelChange: (level: number) => void;
  resizeOptions: ResizeOptions;
  onResizeOptionsChange: (options: ResizeOptions) => void;
  cropOptions: CropOptions;
  onCropOptionsChange: (options: CropOptions) => void;
}

const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
    { value: '1:1', label: '1:1 (Square)' },
    { value: '16:9', label: '16:9 (Widescreen)' },
    { value: '9:16', label: '9:16 (Vertical)' },
    { value: '4:3', label: '4:3 (Standard)' },
    { value: '3:4', label: '3:4 (Portrait)' },
];

export const ConversionOptions: React.FC<ConversionOptionsProps> = ({
  namingConvention,
  onNamingConventionChange,
  compressionLevel,
  onCompressionLevelChange,
  resizeOptions,
  onResizeOptionsChange,
  cropOptions,
  onCropOptionsChange,
}) => {
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    onResizeOptionsChange({ ...resizeOptions, width: value });
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    onResizeOptionsChange({ ...resizeOptions, height: value });
  };

  return (
    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold text-brand-text dark:text-white mb-6">Conversion Options</h3>
      <div className="space-y-8">
        
        {/* Transformations Section */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text dark:text-slate-200 pb-2 border-b border-slate-300 dark:border-slate-600">Transformations</h4>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Resizing */}
            <div>
                <label className="flex items-center space-x-3">
                    <input
                    type="checkbox"
                    checked={resizeOptions.enabled}
                    onChange={(e) => onResizeOptionsChange({ ...resizeOptions, enabled: e.target.checked })}
                    className="h-4 w-4 rounded text-brand-primary border-slate-300 dark:border-slate-600 focus:ring-brand-primary"
                    />
                    <span className="text-md font-medium text-slate-700 dark:text-slate-300">Resize Image</span>
                </label>
                {resizeOptions.enabled && (
                    <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="width" className="block text-sm font-medium text-slate-500 dark:text-slate-400">Width</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="number" name="width" id="width" value={resizeOptions.width ?? ''} onChange={handleWidthChange} placeholder="1920" min="1" className="block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:border-brand-primary focus:ring-brand-primary sm:text-sm pl-3 pr-10 py-2" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-slate-500 dark:text-slate-400 sm:text-sm">px</span></div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-slate-500 dark:text-slate-400">Height</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="number" name="height" id="height" value={resizeOptions.height ?? ''} onChange={handleHeightChange} placeholder="1080" min="1" className="block w-full rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:border-brand-primary focus:ring-brand-primary sm:text-sm pl-3 pr-10 py-2" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-slate-500 dark:text-slate-400 sm:text-sm">px</span></div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Enter one value to preserve aspect ratio.</p>
                    </div>
                )}
            </div>
            {/* Image Cropping */}
            <div>
                <label className="flex items-center space-x-3">
                    <input
                    type="checkbox"
                    checked={cropOptions.enabled}
                    onChange={(e) => onCropOptionsChange({ ...cropOptions, enabled: e.target.checked, aspectRatio: e.target.checked && !cropOptions.aspectRatio ? '1:1' : cropOptions.aspectRatio })}
                    className="h-4 w-4 rounded text-brand-primary border-slate-300 dark:border-slate-600 focus:ring-brand-primary"
                    />
                    <span className="text-md font-medium text-slate-700 dark:text-slate-300">Crop Image</span>
                </label>
                {cropOptions.enabled && (
                    <div className="mt-4">
                        <label htmlFor="aspectRatio" className="block text-sm font-medium text-slate-500 dark:text-slate-400">Aspect Ratio</label>
                        <select
                            id="aspectRatio"
                            name="aspectRatio"
                            value={cropOptions.aspectRatio ?? ''}
                            onChange={(e) => onCropOptionsChange({ ...cropOptions, aspectRatio: e.target.value as AspectRatio })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:bg-slate-800 dark:border-slate-600 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md"
                        >
                            {ASPECT_RATIOS.map(ar => <option key={ar.value} value={ar.value}>{ar.label}</option>)}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Crops from the center of the image.</p>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Output Settings Section */}
        <div>
          <h4 className="text-lg font-semibold text-brand-text dark:text-slate-200 pb-2 border-b border-slate-300 dark:border-slate-600">Output Settings</h4>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Naming Convention */}
            <div>
              <label className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-3">File Naming</label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input id="name-preserve" name="naming-convention" type="radio" checked={namingConvention.type === 'preserve'} onChange={() => onNamingConventionChange({ ...namingConvention, type: 'preserve' })} className="h-4 w-4 text-brand-primary border-slate-300 focus:ring-brand-primary" />
                  <label htmlFor="name-preserve" className="ml-3 block text-sm font-medium text-brand-text dark:text-slate-200">Preserve original name</label>
                </div>
                <div className="flex items-center">
                  <input id="name-suffix" name="naming-convention" type="radio" checked={namingConvention.type === 'suffix'} onChange={() => onNamingConventionChange({ ...namingConvention, type: 'suffix' })} className="h-4 w-4 text-brand-primary border-slate-300 focus:ring-brand-primary" />
                  <label htmlFor="name-suffix" className="ml-3 block text-sm font-medium text-brand-text dark:text-slate-200">Add suffix</label>
                  <input type="text" value={namingConvention.suffix} onChange={(e) => onNamingConventionChange({ ...namingConvention, type: 'suffix', suffix: e.target.value })} onClick={() => onNamingConventionChange({ ...namingConvention, type: 'suffix' })} placeholder="_converted" className="ml-2 block w-full max-w-xs sm:max-w-[120px] rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm text-xs px-2 py-1" />
                </div>
                <div className="flex items-center">
                  <input id="name-prefix" name="naming-convention" type="radio" checked={namingConvention.type === 'prefix'} onChange={() => onNamingConventionChange({ ...namingConvention, type: 'prefix' })} className="h-4 w-4 text-brand-primary border-slate-300 focus:ring-brand-primary" />
                  <label htmlFor="name-prefix" className="ml-3 block text-sm font-medium text-brand-text dark:text-slate-200">Add prefix</label>
                  <input type="text" value={namingConvention.prefix} onChange={(e) => onNamingConventionChange({ ...namingConvention, type: 'prefix', prefix: e.target.value })} onClick={() => onNamingConventionChange({ ...namingConvention, type: 'prefix' })} placeholder="converted_" className="ml-2 block w-full max-w-xs sm:max-w-[120px] rounded-md border-slate-300 dark:bg-slate-800 dark:border-slate-600 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm text-xs px-2 py-1" />
                </div>
              </div>
            </div>

            {/* Compression Level */}
            <div>
              <label htmlFor="compression" className="block text-md font-medium text-slate-700 dark:text-slate-300">
                Image Quality <span className="font-bold text-brand-primary dark:text-brand-primary">{compressionLevel}%</span>
              </label>
              <input id="compression" type="range" min="1" max="100" value={compressionLevel} onChange={(e) => onCompressionLevelChange(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-600 mt-3 accent-brand-primary" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lower quality reduces file size (affects JPEG & WEBP).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};