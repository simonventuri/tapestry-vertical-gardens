import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from 'redis';
import path from 'path';

// Helper function to generate unique IDs
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

async function migrateToRedis() {
    // Open SQLite database
    const db = await open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database,
    });

    // Connect to Redis
    const redis = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();

    console.log('Starting migration from SQLite to Redis...');

    try {
        // Migrate projects
        const projects = await db.all('SELECT * FROM projects ORDER BY created_at ASC');
        console.log(`Found ${projects.length} projects to migrate`);

        for (const project of projects) {
            const projectId = generateId();

            // Store project data in Redis
            await redis.hSet(`project:${projectId}`, {
                id: projectId,
                title: project.title,
                story: project.story || '',
                hero_image: project.hero_image || '',
                slug: project.slug,
                created_at: project.created_at
            });

            // Add to sorted set (using creation timestamp as score)
            const timestamp = new Date(project.created_at).getTime();
            await redis.zAdd('projects:sorted', {
                score: timestamp,
                value: projectId
            });

            // Create slug lookup
            await redis.set(`slug:${project.slug}`, projectId);

            // Migrate project photos
            const photos = await db.all('SELECT * FROM project_photos WHERE project_id = ?', [project.id]);
            for (const photo of photos) {
                const photoId = generateId();
                await redis.hSet(`photo:${photoId}`, {
                    id: photoId,
                    project_id: projectId,
                    image_path: photo.image_path,
                    created_at: photo.created_at
                });
                await redis.lPush(`project:${projectId}:photos`, photoId);
            }

            console.log(`Migrated project: ${project.title} (${photos.length} photos)`);
        }

        // Migrate contacts
        const contacts = await db.all('SELECT * FROM contacts ORDER BY created_at ASC');
        console.log(`Found ${contacts.length} contacts to migrate`);

        for (const contact of contacts) {
            const contactId = generateId();

            await redis.hSet(`contact:${contactId}`, {
                id: contactId,
                name: contact.name,
                email: contact.email,
                phone: contact.phone || '',
                message: contact.message,
                project_type: contact.project_type || '',
                location: contact.location || '',
                budget_range: contact.budget_range || '',
                created_at: contact.created_at,
                status: contact.status || 'new'
            });

            // Add to sorted set
            const timestamp = new Date(contact.created_at).getTime();
            await redis.zAdd('contacts:sorted', {
                score: timestamp,
                value: contactId
            });

            console.log(`Migrated contact: ${contact.name}`);
        }

        console.log('Migration completed successfully!');
        console.log(`Migrated ${projects.length} projects and ${contacts.length} contacts`);

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await db.close();
        await redis.disconnect();
    }
}

// Run migration
migrateToRedis().catch(console.error);
