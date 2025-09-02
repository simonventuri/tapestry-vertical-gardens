#!/usr/bin/env node

// Load environment variables from .env.local (Next.js convention)
require('dotenv').config({ path: '.env.local' });

const { getRedisClient } = require('../lib/database');

async function fixTitleArrays() {
    const redis = await getRedisClient();

    try {
        console.log('🔍 Scanning for title arrays in Redis...');

        // Get all portfolio project keys
        const keys = await redis.keys('portfolio:*');
        const projectKeys = keys.filter(key => !key.includes(':slug:') && !key.includes(':list') && !key.includes(':ordered'));

        console.log(`Found ${projectKeys.length} project keys to check`);

        let fixCount = 0;

        for (const key of projectKeys) {
            const projectData = await redis.hGetAll(key);

            if (!projectData.id) continue;

            const title = projectData.title;

            // Check if title is a JSON array
            let titleArray = null;
            try {
                const parsed = JSON.parse(title);
                if (Array.isArray(parsed)) {
                    titleArray = parsed;
                }
            } catch (e) {
                // Not JSON, which is good for titles
            }

            if (titleArray) {
                console.log(`❌ Found array title in ${key}:`, titleArray);

                // Convert array to string
                const fixedTitle = titleArray.join(' ');

                // Update the title in Redis
                await redis.hSet(key, 'title', fixedTitle);

                console.log(`✅ Fixed title to: "${fixedTitle}"`);
                fixCount++;
            } else {
                console.log(`✅ Title OK in ${key}: "${title}"`);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`• Checked: ${projectKeys.length} projects`);
        console.log(`• Fixed: ${fixCount} array titles`);

        if (fixCount > 0) {
            console.log('\n🎉 All title arrays have been converted to strings!');
        } else {
            console.log('\n✨ No title arrays found - all titles are already strings!');
        }

    } catch (error) {
        console.error('❌ Error fixing title arrays:', error);
        process.exit(1);
    }

    process.exit(0);
}

// Run the script
fixTitleArrays();
