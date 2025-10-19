export enum FileStatus {
  WAITING = 'Waiting',
  CONVERTING = 'Converting...',
  DONE = 'Done',
  ERROR = 'Error'
}

export type SupportedFormat = 'JPG' | 'PNG' | 'WEBP' | 'BMP' | 'TIFF' | 'HEIC' | 'HEIF';

export interface ResizeOptions {
  enabled: boolean;
  width: number | null;
  height: number | null;
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface CropOptions {
  enabled: boolean;
  aspectRatio: AspectRatio | null;
}

export interface ConversionFile {
  id: string;
  originalFile: File;
  targetFormat: SupportedFormat;
  status: FileStatus;
  progress: number; // 0-100
  convertedUrl?: string;
  convertedSize?: number;
  convertedFilename?: string;
}