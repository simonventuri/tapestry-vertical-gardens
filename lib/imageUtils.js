/**
 * Image utilities for base64 storage in Redis
 * Optimized for Vercel serverless environment
 */

// Canvas dependency for server-side image processing
let Canvas;
try {
    Canvas = require('canvas');
} catch (error) {
    console.warn('Canvas not available for server-side image processing');
}

/**
 * Generate thumbnail for portfolio grid (server-side with canvas)
 * Much smaller and optimized for fast loading
 */
async function generateThumbnail(base64String, maxWidth = 400, maxHeight = 300, quality = 0.6) {
    if (!Canvas || !base64String || !base64String.startsWith('data:image/')) {
        return base64String; // Fallback to original if no canvas or invalid input
    }

    try {
        // Remove data URL prefix to get just the base64 data
        const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Load image with canvas
        const img = await Canvas.loadImage(buffer);

        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img;

        if (width > height) {
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }
        }

        // Create canvas and draw resized image
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with compression
        const buffer2 = canvas.toBuffer('image/jpeg', { quality });
        const thumbnail = `data:image/jpeg;base64,${buffer2.toString('base64')}`;

        return thumbnail;
    } catch (error) {
        console.warn('Failed to generate thumbnail:', error);
        return base64String; // Return original on error
    }
}

/**
 * Generate a slug from a title
 */
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

/**
 * Optimize and compress base64 image for storage
 * Uses client-side canvas if available, otherwise returns as-is
 */
async function optimizeBase64Image(base64String, quality = 0.8, maxWidth = 1200, maxHeight = 800) {
    // If running on server-side or no canvas available, return as-is
    if (typeof window === 'undefined' || !base64String.startsWith('data:image/')) {
        return base64String;
    }

    try {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function () {
                // Calculate new dimensions maintaining aspect ratio
                let { width, height } = this;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                // Create canvas and compress
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;

                // Draw and compress to JPEG
                ctx.drawImage(this, 0, 0, width, height);
                const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);

                resolve(optimizedBase64);
            };
            img.onerror = () => resolve(base64String); // Fallback to original
            img.src = base64String;
        });
    } catch (error) {
        console.warn('Failed to optimize image:', error);
        return base64String; // Return original on error
    }
}

/**
 * Process project images for storage
 * Handles both new base64 uploads and existing stored images
 */
async function processProjectImages(images) {
    if (!Array.isArray(images)) {
        return [];
    }

    const processedImages = [];

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        if (typeof image === 'string') {
            if (image.startsWith('data:image/')) {
                // New base64 image - optimize it if possible
                try {
                    const optimized = await optimizeBase64Image(image);
                    processedImages.push(optimized);
                } catch (error) {
                    console.error(`Failed to process image ${i + 1}:`, error.message);
                    // Skip this image on error
                }
            } else {
                // Existing stored image or other format, keep as-is
                processedImages.push(image);
            }
        }
    }

    return processedImages;
}

module.exports = {
    generateSlug,
    generateThumbnail,
    optimizeBase64Image,
    processProjectImages
};
