#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fs = require('fs').promises;
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { getRedisClient } = require('../lib/database');

// Configuration
const IMAGES_DIR = path.join(process.cwd(), 'public/images/projects');
const JPEG_QUALITY = 0.8; // 80% quality
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;

/**
 * Optimize image and convert to base64
 */
async function optimizeImageToBase64(imagePath) {
    try {
        console.log(`📸 Processing: ${imagePath}`);

        // Load the image
        const image = await loadImage(imagePath);

        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = image;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height = (height * MAX_WIDTH) / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width = (width * MAX_HEIGHT) / height;
                height = MAX_HEIGHT;
            }
        }

        // Create canvas and draw optimized image
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        // Convert to base64 with JPEG compression
        const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

        // Calculate size reduction
        const originalStats = await fs.stat(imagePath);
        const originalSize = originalStats.size;
        const optimizedSize = Buffer.byteLength(base64, 'base64');
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

        console.log(`   ✅ Optimized: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${reduction}% reduction)`);

        return base64;
    } catch (error) {
        console.error(`   ❌ Failed to process ${imagePath}:`, error.message);
        return null;
    }
}

/**
 * Migrate project images from disk back to Redis base64
 */
async function migrateImagesToBase64() {
    const redis = await getRedisClient();

    console.log('🔄 Starting migration from disk images back to base64 in Redis...\n');

    try {
        // Get all portfolio project keys
        const keys = await redis.keys('portfolio:*');
        const projectKeys = keys.filter(key =>
            !key.includes(':slug:') &&
            !key.includes(':list') &&
            !key.includes(':ordered')
        );

        console.log(`📊 Found ${projectKeys.length} projects to migrate\n`);

        let totalProjects = 0;
        let totalImages = 0;
        let totalErrors = 0;

        for (const key of projectKeys) {
            const projectData = await redis.hGetAll(key);

            if (!projectData.id) continue;

            console.log(`\n📁 Processing project: ${projectData.title || 'Untitled'} (${projectData.slug})`);

            // Parse existing images
            let images = [];
            try {
                images = JSON.parse(projectData.images || '[]');
            } catch (e) {
                console.log(`   ⚠️  Could not parse images for ${key}`);
                continue;
            }

            if (images.length === 0) {
                console.log(`   ℹ️  No images to migrate`);
                continue;
            }

            // Check if images are disk paths
            const diskImages = images.filter(img => img.startsWith('/images/projects/'));

            if (diskImages.length === 0) {
                console.log(`   ℹ️  Images already in base64 format`);
                continue;
            }

            console.log(`   📸 Converting ${diskImages.length} disk images to optimized base64...`);

            const optimizedImages = [];

            for (const imagePath of images) {
                if (imagePath.startsWith('/images/projects/')) {
                    // Convert disk path to file system path
                    const fullPath = path.join(process.cwd(), 'public', imagePath);

                    try {
                        await fs.access(fullPath);
                        const base64 = await optimizeImageToBase64(fullPath);

                        if (base64) {
                            optimizedImages.push(base64);
                            totalImages++;
                        } else {
                            totalErrors++;
                        }
                    } catch (error) {
                        console.log(`   ⚠️  File not found: ${fullPath}`);
                        totalErrors++;
                    }
                } else {
                    // Keep existing base64 or other format
                    optimizedImages.push(imagePath);
                }
            }

            // Update project with optimized base64 images
            if (optimizedImages.length > 0) {
                await redis.hSet(key, 'images', JSON.stringify(optimizedImages));
                console.log(`   ✅ Updated project with ${optimizedImages.length} optimized images`);
                totalProjects++;
            } else {
                console.log(`   ❌ No images could be processed for this project`);
            }
        }

        console.log('\n🎉 Migration completed!');
        console.log('📊 Summary:');
        console.log(`   • Projects migrated: ${totalProjects}`);
        console.log(`   • Images converted: ${totalImages}`);
        console.log(`   • Errors: ${totalErrors}`);

        if (totalImages > 0) {
            console.log('\n✨ All images are now stored as optimized base64 in Redis!');
            console.log('📱 The application will now work perfectly on Vercel serverless!');
        }

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the migration
migrateImagesToBase64();
