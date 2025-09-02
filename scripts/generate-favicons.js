#!/usr/bin/env node

/**
 * Favicon Generation Script
 * 
 * This script generates all required favicon formats from a source image.
 * Place your logo.png (512x512 recommended) in the public/images/ directory.
 * 
 * Usage:
 * node scripts/generate-favicons.js
 * 
 * Requirements:
 * npm install canvas
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/images/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

const FAVICON_CONFIGS = [
    { name: 'favicon-16x16.png', size: 16, format: 'png' },
    { name: 'favicon-32x32.png', size: 32, format: 'png' },
    { name: 'apple-touch-icon.png', size: 180, format: 'png' },
    { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
    { name: 'android-chrome-512x512.png', size: 512, format: 'png' },
];

async function generateFavicons() {
    try {
        // Check if source image exists
        await fs.access(SOURCE_IMAGE);
        console.log('✓ Source image found:', SOURCE_IMAGE);

        // Load the source image with Canvas
        const sourceImage = await loadImage(SOURCE_IMAGE);
        console.log(`✓ Source image loaded: ${sourceImage.width}x${sourceImage.height}`);

        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });

        for (const config of FAVICON_CONFIGS) {
            const outputPath = path.join(OUTPUT_DIR, config.name);

            try {
                // Create a canvas with the target size
                const canvas = createCanvas(config.size, config.size);
                const ctx = canvas.getContext('2d');

                // Calculate dimensions to maintain aspect ratio and center the image
                const sourceAspect = sourceImage.width / sourceImage.height;
                const targetAspect = 1; // Square favicon

                let drawWidth, drawHeight, drawX, drawY;

                if (sourceAspect > targetAspect) {
                    // Source is wider, fit by height
                    drawHeight = config.size;
                    drawWidth = drawHeight * sourceAspect;
                    drawX = (config.size - drawWidth) / 2;
                    drawY = 0;
                } else {
                    // Source is taller or square, fit by width
                    drawWidth = config.size;
                    drawHeight = drawWidth / sourceAspect;
                    drawX = 0;
                    drawY = (config.size - drawHeight) / 2;
                }

                // Draw the image centered and scaled
                ctx.drawImage(sourceImage, drawX, drawY, drawWidth, drawHeight);

                // Save as PNG
                const buffer = canvas.toBuffer('image/png');
                await fs.writeFile(outputPath, buffer);
                console.log('✓ Generated:', config.name);

            } catch (error) {
                console.error('✗ Failed to generate', config.name, ':', error.message);
            }
        }

        // Generate a simple favicon.ico by copying the 32x32 PNG
        try {
            const favicon32Path = path.join(OUTPUT_DIR, 'favicon-32x32.png');
            const faviconIcoPath = path.join(OUTPUT_DIR, 'favicon.ico');
            const faviconBuffer = await fs.readFile(favicon32Path);
            await fs.writeFile(faviconIcoPath, faviconBuffer);
            console.log('✓ Generated: favicon.ico (copied from 32x32 PNG)');
        } catch (error) {
            console.error('✗ Failed to generate favicon.ico:', error.message);
        }

        // Generate updated site.webmanifest
        const manifestPath = path.join(OUTPUT_DIR, 'site.webmanifest');
        const manifest = {
            name: "Tapestry Vertical Gardens",
            short_name: "Tapestry VG",
            description: "Expert vertical garden design and installation in London",
            icons: [
                {
                    src: "/android-chrome-192x192.png",
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: "/android-chrome-512x512.png",
                    sizes: "512x512",
                    type: "image/png"
                }
            ],
            theme_color: "#2d5016",
            background_color: "#ffffff",
            display: "standalone",
            start_url: "/",
            scope: "/"
        };

        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('✓ Updated site.webmanifest');

        console.log('\n🎉 Favicon generation complete!');
        console.log('\nNext steps:');
        console.log('1. Verify favicons are working by visiting your site');
        console.log('2. Test PWA functionality');
        console.log('3. Check favicon display in various browsers');

    } catch (error) {
        console.error('✗ Error generating favicons:', error.message);

        if (error.code === 'ENOENT') {
            console.log('\n📝 To fix this:');
            console.log('1. Install canvas: npm install canvas');
            console.log('2. Place your logo.png (512x512 recommended) in public/images/');
            console.log('3. Run this script again: node scripts/generate-favicons.js');
        }

        process.exit(1);
    }
}

// Check if Canvas is available
async function checkDependencies() {
    try {
        require('canvas');
        return true;
    } catch (error) {
        console.error('✗ Canvas package not found');
        console.log('Install it with: npm install canvas');
        return false;
    }
}

async function main() {
    console.log('🎨 Generating favicons for Tapestry Vertical Gardens...\n');

    const hasCanvas = await checkDependencies();
    if (!hasCanvas) {
        process.exit(1);
    }

    await generateFavicons();
}

if (require.main === module) {
    main();
}

module.exports = { generateFavicons };
