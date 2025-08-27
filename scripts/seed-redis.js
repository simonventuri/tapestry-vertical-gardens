import { createClient } from 'redis';

// Helper function to generate unique IDs
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

async function seedRedis() {
    const redis = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redis.on('error', (err) => console.log('Redis Client Error', err));
    await redis.connect();

    console.log('Seeding Redis with portfolio data...');

    // Same 10 projects as the original SQLite seed file
    const projects = [
        {
            title: "Lorem Ipsum Vertical Garden",
            story: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "lorem-ipsum-vertical-garden"
        },
        {
            title: "Consectetur Living Wall",
            story: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "consectetur-living-wall"
        },
        {
            title: "Adipiscing Garden Project",
            story: "Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "adipiscing-garden-project"
        },
        {
            title: "Tempor Incididunt Installation",
            story: "Tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "tempor-incididunt-installation"
        },
        {
            title: "Labore Et Dolore Wall",
            story: "Labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "labore-et-dolore-wall"
        },
        {
            title: "Magna Aliqua Vertical Design",
            story: "Magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "magna-aliqua-vertical-design"
        },
        {
            title: "Minim Veniam Garden Space",
            story: "Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "minim-veniam-garden-space"
        },
        {
            title: "Nostrud Exercitation Project",
            story: "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "nostrud-exercitation-project"
        },
        {
            title: "Ullamco Laboris Living Wall",
            story: "Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "ullamco-laboris-living-wall"
        },
        {
            title: "Commodo Consequat Installation",
            story: "Commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis.",
            hero_image: "/images/project_photos/hero-vertical-gardens-uk.jpg",
            slug: "commodo-consequat-installation"
        }
    ];

    try {
        // Clear existing data first
        console.log('Clearing existing Redis data...');
        await redis.flushDb();

        let timestamp = Date.now();

        for (const project of projects) {
            const projectId = generateId();
            const createdAt = new Date(timestamp).toISOString();

            // Store project data
            await redis.hSet(`project:${projectId}`, {
                id: projectId,
                title: project.title,
                story: project.story,
                hero_image: project.hero_image,
                slug: project.slug,
                created_at: createdAt
            });

            // Add to sorted set for ordering (using timestamp as score)
            await redis.zAdd('projects:sorted', {
                score: timestamp,
                value: projectId
            });

            // Create slug lookup
            await redis.set(`slug:${project.slug}`, projectId);

            console.log(`Seeded project: ${project.title}`);

            // Increment timestamp to ensure proper ordering
            timestamp += 1000; // 1 second interval
        }

        console.log('Redis seeding completed successfully!');
        console.log(`Seeded ${projects.length} projects`);

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await redis.disconnect();
    }
}

// Run seeding
seedRedis().catch(console.error);
