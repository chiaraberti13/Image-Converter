import React from 'react';
import { SUPPORTED_FORMATS } from '../constants';
import { type SupportedFormat } from '../types';

interface BulkFormatSelectorProps {
    onFormatChange: (format: SupportedFormat) => void;
}

export const BulkFormatSelector: React.FC<BulkFormatSelectorProps> = ({ onFormatChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFormat = e.target.value as SupportedFormat;
        if (selectedFormat) {
            onFormatChange(selectedFormat);
            // Reset the dropdown to allow re-selecting the same option after other changes
            e.target.value = '';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="bulk-format-select" className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                Convert all to:
            </label>
            <select
                id="bulk-format-select"
                onChange={handleChange}
                defaultValue=""
                className="text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md py-1.5 px-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                aria-label="Select format for all files"
            >
                <option value="" disabled>Select...</option>
                {SUPPORTED_FORMATS.map(format => (
                    <option key={format} value={format}>{format}</option>
                ))}
            </select>
        </div>
    );
};
