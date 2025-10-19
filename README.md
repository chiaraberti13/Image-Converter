# Image Converter

A powerful, client-side image conversion tool built with React and Tailwind CSS. This application allows you to convert images to various formats like JPG, PNG, WEBP, BMP, and TIFF directly in your browser. With batch processing capabilities and advanced conversion options, it's designed for speed, privacy, and ease of use.

## Key Features

- **Client-Side Conversion:** All image processing happens locally on your device. Your files are never uploaded to a server, ensuring maximum privacy and security.
- **Batch Processing:** Upload and convert multiple images simultaneously.
- **Wide Format Support:** Supports a variety of input formats including JPG, PNG, WEBP, GIF, BMP, TIFF, and HEIC/HEIF.
- **Advanced Options:** Fine-tune your conversions with options for resizing, cropping, quality adjustment, and filename customization.
- **Download All:** Download all your converted images in a single ZIP archive for convenience.
- **Responsive UI:** A clean, modern, and responsive user interface that works seamlessly on desktop and mobile devices.

## How It Works

1.  **Upload:** Drag and drop your image files or select them from your device.
2.  **Configure:** Choose the target format for each file individually or set a format for all files at once. Adjust advanced settings like quality, dimensions, and cropping as needed.
3.  **Convert:** Click the "Convert" button to start the process. The conversion is performed by your browser.
4.  **Download:** Download your converted files one by one or all together in a ZIP file.

## Detailed Functions

### Conversion Queue
Once files are uploaded, they appear in a queue where you can manage them before conversion. You can:
- See the original filename and size.
- Set a specific output format for each image (`JPG`, `PNG`, `WEBP`, `BMP`, `TIFF`).
- Remove individual files or clear the entire queue.

### Bulk Operations
- **Convert All To:** Quickly set the same target format for all files in the queue.
- **Download All:** After conversion, a "Download All" button appears, allowing you to download a ZIP file containing all the successfully converted images.

### Conversion Options

A dedicated section provides granular control over the output:

- **Transformations:**
    - **Resize Image:** Enable and specify a target width and/or height in pixels. If only one dimension is provided, the aspect ratio is maintained.
    - **Crop Image:** Enable and select a predefined aspect ratio (e.g., 1:1 Square, 16:9 Widescreen) to crop the image from its center.

- **Output Settings:**
    - **File Naming:** Choose how to name your converted files:
        - **Preserve original name:** `my-image.jpg` -> `my-image.png`
        - **Add suffix:** `my-image.jpg` -> `my-image_converted.png`
        - **Add prefix:** `my-image.jpg` -> `converted_my-image.png`
    - **Image Quality:** Adjust a slider from 1% to 100% to control the compression level and file size for lossy formats like JPG and WEBP.

## Technology Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Image Processing:** Browser Canvas API
- **Special Formats:** `heic2any` (for HEIC/HEIF), `utif` (for TIFF)
- **Archiving:** `jszip`

---
&copy; 2025 Chiara Berti 13
