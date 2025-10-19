import { type SupportedFormat } from './types';

export const SUPPORTED_FORMATS: SupportedFormat[] = ['JPG', 'PNG', 'WEBP', 'BMP', 'TIFF', 'HEIC', 'HEIF'];
export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;