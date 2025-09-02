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
 * npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const SOURCE_IMAGE = path.join(__dirname, '../public/images/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

const FAVICON_CONFIGS = [
    { name: 'favicon.ico', size: 32, format: 'ico' },
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

        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        for (const config of FAVICON_CONFIGS) {
            const outputPath = path.join(OUTPUT_DIR, config.name);
            
            try {
                let pipeline = sharp(SOURCE_IMAGE)
                    .resize(config.size, config.size, {
                        fit: 'cover',
                        position: 'center'
                    });

                if (config.format === 'png') {
                    pipeline = pipeline.png({ quality: 90 });
                } else if (config.format === 'ico') {
                    // For ICO, we'll generate PNG and rename it
                    pipeline = pipeline.png({ quality: 90 });
                }

                await pipeline.toFile(outputPath);
                console.log('✓ Generated:', config.name);
                
            } catch (error) {
                console.error('✗ Failed to generate', config.name, ':', error.message);
            }
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
            console.log('1. Install sharp: npm install sharp');
            console.log('2. Place your logo.png (512x512 recommended) in public/images/');
            console.log('3. Run this script again: node scripts/generate-favicons.js');
        }
        
        process.exit(1);
    }
}

// Check if Sharp is available
async function checkDependencies() {
    try {
        require('sharp');
        return true;
    } catch (error) {
        console.error('✗ Sharp package not found');
        console.log('Install it with: npm install sharp');
        return false;
    }
}

async function main() {
    console.log('🎨 Generating favicons for Tapestry Vertical Gardens...\n');
    
    const hasSharp = await checkDependencies();
    if (!hasSharp) {
        process.exit(1);
    }
    
    await generateFavicons();
}

if (require.main === module) {
    main();
}

module.exports = { generateFavicons };
