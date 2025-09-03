const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Configuration
const IMAGES_DIR = path.join(process.cwd(), 'public/images/projects');

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
 * Generate a unique filename
 */
function generateFilename(originalName, index) {
    const ext = path.extname(originalName) || '.jpg';
    return `image-${index + 1}${ext}`;
}

/**
 * Ensure project directory exists
 */
async function ensureProjectDirectory(projectSlug) {
    const projectDir = path.join(IMAGES_DIR, projectSlug);
    try {
        await fs.access(projectDir);
    } catch {
        await fs.mkdir(projectDir, { recursive: true });
    }
    return projectDir;
}

/**
 * Save a base64 image to disk and return the public path
 */
async function saveBase64Image(base64String, projectSlug, imageIndex) {
    if (!base64String || !base64String.startsWith('data:image/')) {
        throw new Error('Invalid base64 image data');
    }

    // Extract image data and extension
    const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid base64 format');
    }

    const [, extension, data] = matches;
    const buffer = Buffer.from(data, 'base64');

    // Ensure project directory exists
    const projectDir = await ensureProjectDirectory(projectSlug);

    // Generate filename
    const filename = `image-${imageIndex + 1}.${extension}`;
    const filePath = path.join(projectDir, filename);

    // Save file
    await fs.writeFile(filePath, buffer);

    // Return public path
    return `/images/projects/${projectSlug}/${filename}`;
}

/**
 * Delete an image file from disk
 */
async function deleteImageFile(imagePath) {
    try {
        // Convert public path to file system path
        const relativePath = imagePath.replace('/images/projects/', '');
        const filePath = path.join(IMAGES_DIR, relativePath);

        await fs.unlink(filePath);
        console.log(`Deleted image file: ${filePath}`);
    } catch (error) {
        console.error(`Failed to delete image file ${imagePath}:`, error.message);
    }
}

/**
 * Delete all images for a project
 */
async function deleteProjectImages(projectSlug) {
    try {
        const projectDir = path.join(IMAGES_DIR, projectSlug);
        const files = await fs.readdir(projectDir);

        const deletePromises = files.map(file =>
            fs.unlink(path.join(projectDir, file))
        );

        await Promise.all(deletePromises);
        await fs.rmdir(projectDir);

        console.log(`Deleted project directory: ${projectDir}`);
    } catch (error) {
        console.error(`Failed to delete project images for ${projectSlug}:`, error.message);
    }
}

/**
 * Process image array for a project - converts base64 to disk storage
 */
async function processProjectImages(images, projectSlug) {
    if (!Array.isArray(images)) {
        return [];
    }

    const processedImages = [];

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        if (typeof image === 'string') {
            if (image.startsWith('data:image/')) {
                // Convert base64 to disk storage
                try {
                    const imagePath = await saveBase64Image(image, projectSlug, i);
                    processedImages.push(imagePath);
                } catch (error) {
                    console.error(`Failed to process image ${i + 1}:`, error.message);
                    // Skip this image
                }
            } else if (image.startsWith('/images/projects/')) {
                // Already a disk path, keep as-is
                processedImages.push(image);
            } else {
                // Other URL format, keep as-is
                processedImages.push(image);
            }
        }
    }

    return processedImages;
}

/**
 * Update project images - handles additions, deletions, and reordering
 */
async function updateProjectImages(oldImages, newImages, projectSlug) {
    const oldImagePaths = Array.isArray(oldImages) ? oldImages : [];
    const processedNewImages = await processProjectImages(newImages, projectSlug);

    // Find images to delete (old images not in new list)
    const imagesToDelete = oldImagePaths.filter(oldPath =>
        oldPath.startsWith('/images/projects/') &&
        !processedNewImages.includes(oldPath)
    );

    // Delete removed images
    for (const imagePath of imagesToDelete) {
        await deleteImageFile(imagePath);
    }

    return processedNewImages;
}

module.exports = {
    generateSlug,
    generateFilename,
    saveBase64Image,
    deleteImageFile,
    deleteProjectImages,
    processProjectImages,
    updateProjectImages,
    ensureProjectDirectory
};
