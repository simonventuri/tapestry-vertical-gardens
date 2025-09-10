#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { getRedisClient } = require('./lib/database');

async function debugProjectImages() {
    const redis = await getRedisClient();

    console.log('🔍 Debugging Test Project images...\n');

    try {
        // Get the test project
        const projectId = '175682630113482iq6li0p';
        const existingProject = await redis.hGetAll(`portfolio:${projectId}`);

        if (!existingProject.id) {
            console.log('❌ Test project not found');
            return;
        }

        console.log('📋 Project info:');
        console.log('- Title:', existingProject.title);
        console.log('- Slug:', existingProject.slug);

        // Parse the images
        let images = [];
        try {
            images = JSON.parse(existingProject.images || '[]');
        } catch (e) {
            console.log('❌ Failed to parse images:', e.message);
            return;
        }

        console.log('\n📸 Current images in database:');
        images.forEach((img, index) => {
            console.log(`${index + 1}. ${img}`);
        });

        console.log(`\n📊 Total images: ${images.length}`);

        // Check if the images are disk paths or base64
        const diskImages = images.filter(img => img.startsWith('/images/projects/'));
        const base64Images = images.filter(img => img.startsWith('data:image/'));

        console.log(`📁 Disk images: ${diskImages.length}`);
        console.log(`💾 Base64 images: ${base64Images.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

debugProjectImages();
