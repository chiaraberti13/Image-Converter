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
      // CORREZIONE 1: Logica di processamento unificata per gestire sorgenti multiple (Image or Canvas).
      // Questa funzione contiene la logica principale per il ridimensionamento, il ritaglio e l'esportazione.
      const processSource = (source: HTMLImageElement | HTMLCanvasElement) => {
          onProgress(50);
          const canvas = document.createElement('canvas');
          
          const sourceNaturalWidth = 'naturalWidth' in source ? source.naturalWidth : source.width;
          const sourceNaturalHeight = 'naturalHeight' in source ? source.naturalHeight : source.height;

          let sourceX = 0;
          let sourceY = 0;
          let sourceWidth = sourceNaturalWidth;
          let sourceHeight = sourceNaturalHeight;

          // 1. Applica il ritaglio (Crop)
          if (cropOptions && cropOptions.enabled && cropOptions.aspectRatio) {
              const targetAspectRatio = parseAspectRatio(cropOptions.aspectRatio);
              const imageAspectRatio = sourceWidth / sourceHeight;

              if (imageAspectRatio > targetAspectRatio) {
                  sourceWidth = sourceHeight * targetAspectRatio;
                  sourceX = (sourceNaturalWidth - sourceWidth) / 2;
              } else if (imageAspectRatio < targetAspectRatio) {
                  sourceHeight = sourceWidth / targetAspectRatio;
                  sourceY = (sourceNaturalHeight - sourceHeight) / 2;
              }
          }

          // 2. Applica il ridimensionamento (Resize), basandosi sulle dimensioni dopo il ritaglio
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
          
          if (targetFormat === 'JPG' || targetFormat === 'BMP') {
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
          onProgress(75);

          if (targetFormat === 'TIFF') {
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
          
          let conversionFormat = targetFormat;
          if (targetFormat === 'HEIC' || targetFormat === 'HEIF') {
            conversionFormat = 'PNG';
          }

          let mimeType = `image/${conversionFormat.toLowerCase()}`;
          if (conversionFormat === 'JPG') mimeType = 'image/jpeg';
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Canvas toBlob returned null'));
              const url = URL.createObjectURL(blob);
              onProgress(100);
              resolve({ url, size: blob.size });
            },
            mimeType,
            quality
          );
      };

      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      // CORREZIONE 1: Gestione robusta dei file TIFF.
      // Il file viene decodificato su un canvas e questo canvas viene passato direttamente
      // alla funzione di processamento, evitando il fragile passaggio intermedio di creare un blob PNG.
      if (fileName.endsWith('.tiff') || fileName.endsWith('.tif') || fileType.includes('tiff')) {
        onProgress(10);
        const arrayBuffer = await file.arrayBuffer();
        const ifds = UTIF.decode(arrayBuffer);
        if (!ifds || ifds.length === 0) return reject(new Error('Invalid TIFF file'));
        const firstPage = ifds[0];
        UTIF.decodeImage(arrayBuffer, firstPage);
        const rgba = UTIF.toRGBA8(firstPage);

        const decodedCanvas = document.createElement('canvas');
        decodedCanvas.width = firstPage.width;
        decodedCanvas.height = firstPage.height;
        const ctx = decodedCanvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context for TIFF decoding'));
        
        const imageData = new ImageData(new Uint8ClampedArray(rgba), firstPage.width, firstPage.height);
        ctx.putImageData(imageData, 0, 0);
        onProgress(25);
        processSource(decodedCanvas);
      } else {
        // Gestione di tutti gli altri tipi di immagine (incluso HEIC dopo la pre-conversione)
        let blobToProcess: Blob = file;
        if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || fileType.includes('heic') || fileType.includes('heif')) {
          onProgress(10);
          const convertedBlob = await heic2any({ blob: file, toType: "image/png" });
          blobToProcess = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          onProgress(20);
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          onProgress(25);
          const img = new Image();
          img.onload = () => processSource(img);
          img.onerror = () => reject(new Error('Image could not be loaded'));
          if (e.target?.result) {
            img.src = e.target.result as string;
          } else {
            reject(new Error('FileReader result is null'));
          }
        };
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsDataURL(blobToProcess);
      }
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