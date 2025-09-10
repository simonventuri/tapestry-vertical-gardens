#!/usr/bin/env node

/**
 * Migration script to move images from Redis (base64) to disk storage
 * 
 * This script will:
 * 1. Read all projects from Redis
 * 2. Extract base64 images and save them to /public/images/projects/{slug}/
 * 3. Update Redis records to store image paths instead of base64 data
 * 4. Create backup of original data before migration
 */

const { createClient } = require('redis');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const IMAGES_DIR = path.join(__dirname, '../public/images/projects');
const BACKUP_DIR = path.join(__dirname, '../backups');

async function connectRedis() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        throw new Error('REDIS_URL environment variable is not set');
    }

    const client = createClient({
        url: redisUrl,
        socket: {
            tls: redisUrl.includes('rediss://'),
            rejectUnauthorized: false
        }
    });

    await client.connect();
    console.log('✅ Connected to Redis');
    return client;
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

function isBase64Image(str) {
    return str && str.startsWith('data:image/');
}

function getImageExtension(base64String) {
    const match = base64String.match(/data:image\/([a-zA-Z]*);base64,/);
    return match ? match[1] : 'jpg';
}

function base64ToBuffer(base64String) {
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

async function ensureDirectoryExists(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

async function saveImageToDisk(base64String, projectSlug, imageIndex) {
    const extension = getImageExtension(base64String);
    const filename = `image-${imageIndex + 1}.${extension}`;
    const projectDir = path.join(IMAGES_DIR, projectSlug);

    await ensureDirectoryExists(projectDir);

    const filePath = path.join(projectDir, filename);
    const buffer = base64ToBuffer(base64String);

    await fs.writeFile(filePath, buffer);

    // Return the public path (relative to /public)
    return `/images/projects/${projectSlug}/${filename}`;
}

async function backupProject(redis, projectId, projectData) {
    await ensureDirectoryExists(BACKUP_DIR);
    const backupFile = path.join(BACKUP_DIR, `project-${projectId}-backup.json`);
    await fs.writeFile(backupFile, JSON.stringify(projectData, null, 2));
}

async function migrateProject(redis, projectId) {
    console.log(`\n🔄 Migrating project: ${projectId}`);

    // Get project data
    const projectData = await redis.hGetAll(`portfolio:${projectId}`);
    if (!projectData.id) {
        console.log(`❌ Project ${projectId} not found`);
        return;
    }

    // Create backup
    await backupProject(redis, projectId, projectData);

    const title = projectData.title || 'untitled-project';
    const projectSlug = projectData.slug || generateSlug(title);

    console.log(`   Title: ${title}`);
    console.log(`   Slug: ${projectSlug}`);

    // Parse images
    let images;
    try {
        images = JSON.parse(projectData.images || '[]');
    } catch (error) {
        console.log(`   ❌ Error parsing images: ${error.message}`);
        return;
    }

    if (!Array.isArray(images) || images.length === 0) {
        console.log(`   ℹ️ No images to migrate`);
        return;
    }

    // Process images
    const newImagePaths = [];
    let migratedCount = 0;

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        if (isBase64Image(image)) {
            try {
                const imagePath = await saveImageToDisk(image, projectSlug, i);
                newImagePaths.push(imagePath);
                migratedCount++;
                console.log(`   ✅ Migrated image ${i + 1}: ${imagePath}`);
            } catch (error) {
                console.log(`   ❌ Error migrating image ${i + 1}: ${error.message}`);
                newImagePaths.push(image); // Keep original if migration fails
            }
        } else {
            // Already a path or URL, keep as-is
            newImagePaths.push(image);
            console.log(`   ℹ️ Kept existing path for image ${i + 1}: ${image.substring(0, 50)}...`);
        }
    }

    // Update Redis with new image paths
    if (migratedCount > 0) {
        await redis.hSet(`portfolio:${projectId}`, 'images', JSON.stringify(newImagePaths));
        console.log(`   ✅ Updated Redis record with ${newImagePaths.length} image paths`);
    }

    console.log(`   📊 Migrated ${migratedCount}/${images.length} images`);
}

async function runMigration() {
    console.log('🚀 Starting image migration from Redis to disk storage\n');

    let redis;
    try {
        // Connect to Redis
        redis = await connectRedis();

        // Get all project IDs
        const projectIds = await redis.sMembers('portfolio:list');
        console.log(`📋 Found ${projectIds.length} projects to migrate\n`);

        if (projectIds.length === 0) {
            console.log('ℹ️ No projects found to migrate');
            return;
        }

        // Create necessary directories
        await ensureDirectoryExists(IMAGES_DIR);
        await ensureDirectoryExists(BACKUP_DIR);

        // Migrate each project
        let totalMigrated = 0;
        for (const projectId of projectIds) {
            try {
                await migrateProject(redis, projectId);
                totalMigrated++;
            } catch (error) {
                console.log(`❌ Error migrating project ${projectId}: ${error.message}`);
            }
        }

        console.log(`\n🎉 Migration completed!`);
        console.log(`📊 Successfully processed ${totalMigrated}/${projectIds.length} projects`);
        console.log(`📁 Images saved to: ${IMAGES_DIR}`);
        console.log(`💾 Backups saved to: ${BACKUP_DIR}`);

    } catch (error) {
        console.error('💥 Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (redis) {
            await redis.disconnect();
            console.log('🔌 Disconnected from Redis');
        }
    }
}

// Run migration if this script is executed directly
if (require.main === module) {
    runMigration().catch(console.error);
}

module.exports = { runMigration };
