/**
 * Image processing utilities for CMS file uploads.
 * Supports converting files selected from the device/file explorer into optimized Data URLs,
 * with automatic resizing for high-resolution images to avoid excessive payload sizes.
 */

export interface ProcessedImage {
  dataUrl: string;
  fileName: string;
  fileSize: number;
  formattedSize: string;
  width: number;
  height: number;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Converts a File from device/file explorer to an optimized Data URL.
 * Automatically scales down large images (e.g. 4K camera photos/screenshots)
 * to reasonable web dimensions (max 1600px width/height) and compresses to ~100-300KB WebP/JPEG,
 * while preserving SVGs and animated GIFs as raw Data URLs.
 */
export const fileToDataUrl = (
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      return reject(new Error('Selected file is not an image (PNG, JPG, WEBP, GIF, SVG supported).'));
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read image file from device.'));

    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // For SVGs or animated GIFs, keep original vector/animation intact
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        return resolve({
          dataUrl: rawDataUrl,
          fileName: file.name,
          fileSize: file.size,
          formattedSize: formatFileSize(file.size),
          width: 0,
          height: 0,
        });
      }

      // For raster images, load into an off-screen image element to scale & compress
      const img = new Image();
      img.onerror = () => {
        // Fallback to raw data url if image decode fails
        resolve({
          dataUrl: rawDataUrl,
          fileName: file.name,
          fileSize: file.size,
          formattedSize: formatFileSize(file.size),
          width: 0,
          height: 0,
        });
      };

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            dataUrl: rawDataUrl,
            fileName: file.name,
            fileSize: file.size,
            formattedSize: formatFileSize(file.size),
            width: img.width,
            height: img.height,
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG
        const outputMime = file.type === 'image/png' && file.size < 400 * 1024 ? 'image/png' : 'image/webp';
        let compressedDataUrl = canvas.toDataURL(outputMime, quality);

        // Fallback to jpeg if webp not supported
        if (!compressedDataUrl.startsWith('data:image/webp') && outputMime === 'image/webp') {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Calculate approximate size of base64
        const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          fileName: file.name,
          fileSize: approxBytes,
          formattedSize: formatFileSize(approxBytes),
          width,
          height,
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
};

