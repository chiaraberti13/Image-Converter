
import heic2any from 'heic2any';
import UTIF from 'utif';
import { type SupportedFormat, type ResizeOptions, type CropOptions, type AspectRatio } from '../types';

const parseAspectRatio = (aspectRatio: AspectRatio): number => {
  const [width, height] = aspectRatio.split(':').map(Number);
  return width / height;
}

export const convertImage = (
  file: File,
  targetFormat: SupportedFormat,
  quality: number,
  onProgress: (progress: number) => void,
  resizeOptions?: ResizeOptions,
  cropOptions?: CropOptions
): Promise<{ url: string; size: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      let blobToProcess: Blob = file;
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      // Handle special formats by converting them to a processable format first
      if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || fileType.includes('heic') || fileType.includes('heif')) {
        onProgress(10);
        const convertedBlob = await heic2any({ blob: file, toType: "image/png" });
        blobToProcess = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        onProgress(20);
      } else if (fileName.endsWith('.tiff') || fileName.endsWith('.tif') || fileType.includes('tiff')) {
        onProgress(10);
        const arrayBuffer = await file.arrayBuffer();
        const ifds = UTIF.decode(arrayBuffer);
        const firstPage = ifds[0];
        UTIF.decodeImage(arrayBuffer, firstPage);
        const rgba = UTIF.toRGBA8(firstPage);

        const canvas = document.createElement('canvas');
        canvas.width = firstPage.width;
        canvas.height = firstPage.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context for TIFF decoding'));
        }
        const imageData = new ImageData(new Uint8ClampedArray(rgba), firstPage.width, firstPage.height);
        ctx.putImageData(imageData, 0, 0);
        
        const convertedBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
        if (!convertedBlob) {
          return reject(new Error('Failed to convert TIFF canvas to blob'));
        }
        blobToProcess = convertedBlob;
        onProgress(20);
      }
      
      const reader = new FileReader();

      reader.onload = (e) => {
        onProgress(25);
        const img = new Image();
        img.onload = () => {
          onProgress(50);
          const canvas = document.createElement('canvas');
          
          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = img.width;
          let sourceHeight = img.height;

          // 1. Apply Crop
          if (cropOptions && cropOptions.enabled && cropOptions.aspectRatio) {
              const targetAspectRatio = parseAspectRatio(cropOptions.aspectRatio);
              const imageAspectRatio = img.width / img.height;

              if (imageAspectRatio > targetAspectRatio) { // Image is wider than target, crop sides
                  sourceWidth = img.height * targetAspectRatio;
                  sourceX = (img.width - sourceWidth) / 2;
              } else if (imageAspectRatio < targetAspectRatio) { // Image is taller than target, crop top/bottom
                  sourceHeight = img.width / targetAspectRatio;
                  sourceY = (img.height - sourceHeight) / 2;
              }
          }

          // 2. Apply Resize (based on cropped dimensions)
          let newWidth = sourceWidth;
          let newHeight = sourceHeight;

          if (resizeOptions && resizeOptions.enabled && (resizeOptions.width || resizeOptions.height)) {
            const croppedAspectRatio = sourceWidth / sourceHeight;
            const targetWidth = resizeOptions.width;
            const targetHeight = resizeOptions.height;
            
            if (targetWidth && targetHeight) {
              newWidth = targetWidth;
              newHeight = targetHeight;
            } else if (targetWidth) {
              newWidth = targetWidth;
              newHeight = targetWidth / croppedAspectRatio;
            } else if (targetHeight) {
              newHeight = targetHeight;
              newWidth = targetHeight * croppedAspectRatio;
            }
          }
          
          canvas.width = Math.round(newWidth);
          canvas.height = Math.round(newHeight);
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Could not get canvas context'));
          }
          
          // For formats that don't support transparency, fill with white
          if (targetFormat === 'JPG' || targetFormat === 'BMP') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
          onProgress(75);

          if (targetFormat === 'TIFF') {
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              // FIX: Use UTIF.encodeImage instead of UTIF.encode, as encode expects 1 argument but was given 3.
              // encodeImage correctly takes the image data buffer, width, and height.
              const tiffBuffer = UTIF.encodeImage(imageData.data, canvas.width, canvas.height);
              const blob = new Blob([tiffBuffer], { type: 'image/tiff' });
              const url = URL.createObjectURL(blob);
              onProgress(100);
              resolve({ url, size: blob.size });
            } catch (err) {
              reject(new Error('Failed to encode TIFF image'));
            }
            return;
          }

          let mimeType = `image/${targetFormat.toLowerCase()}`;
          if (targetFormat === 'JPG') {
              mimeType = 'image/jpeg';
          }
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Canvas toBlob returned null'));
              }
              const url = URL.createObjectURL(blob);
              onProgress(100);
              resolve({ url, size: blob.size });
            },
            mimeType,
            quality // Quality setting for JPEG/WEBP
          );
        };
        img.onerror = () => reject(new Error('Image could not be loaded'));
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('FileReader result is null'));
        }
      };

      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsDataURL(blobToProcess);
    } catch (err) {
      console.error('Conversion failed:', err);
      reject(err);
    }
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
