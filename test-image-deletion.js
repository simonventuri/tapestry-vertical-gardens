#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { updateProjectImages } = require('./lib/imageUtils');

async function testImageDeletion() {
    console.log('🧪 Testing image deletion functionality...\n');

    // Simulate existing images in database (from migration - these are disk paths)
    const existingImages = [
        '/images/projects/test-project/image-1.jpg',
        '/images/projects/test-project/image-2.jpg',
        '/images/projects/test-project/image-3.jpg'
    ];

    // Simulate new images from form (user deleted image-2, so only 1 and 3 remain)
    const newImages = [
        '/images/projects/test-project/image-1.jpg',
        '/images/projects/test-project/image-3.jpg'
    ];

    console.log('📁 Existing images (from DB):', existingImages);
    console.log('📝 New images (from form):', newImages);
    console.log('🎯 Expected: image-2.jpg should be deleted\n');

    try {
        const result = await updateProjectImages(existingImages, newImages, 'test-project');
        console.log('✅ Result:', result);
        console.log('\n✨ Test completed successfully!');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testImageDeletion();
