import { createClient } from 'redis';

let redis = null;

export async function getRedisClient() {
    if (!redis) {
        let redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is not set');
        }

        // Clean up the URL - remove quotes and the REDIS_URL= prefix if present
        redisUrl = redisUrl.replace(/^["']|["']$/g, ''); // Remove quotes
        redisUrl = redisUrl.replace(/^REDIS_URL=/, ''); // Remove REDIS_URL= prefix

        console.log('Connecting to Redis with URL:', redisUrl.replace(/\/\/.*@/, '//***@')); // Log without credentials

        redis = createClient({
            url: redisUrl,
            socket: {
                tls: redisUrl.includes('rediss://'),
                rejectUnauthorized: false
            }
        });

        redis.on('error', (err) => {
            console.log('Redis Client Error', err);
            redis = null; // Reset on error
        });

        redis.on('connect', () => {
            console.log('Redis connected successfully');
        });

        await redis.connect();
    }
    return redis;
}

// Helper function to generate unique IDs
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Wrapper function for database operations with error handling
async function withRedis(operation) {
    try {
        const redis = await getRedisClient();
        return await operation(redis);
    } catch (error) {
        console.error('Database operation failed:', error);
        throw error;
    }
}

export async function getPortfolioItems() {
    return withRedis(async (redis) => {
        // Get all project IDs
        const projectIds = await redis.zRange('projects:sorted', 0, -1, { REV: true });

        if (!projectIds.length) return [];

        // Get all project data
        const projects = [];
        for (const id of projectIds) {
            const projectData = await redis.hGetAll(`project:${id}`);
            if (projectData.id) {
                projects.push({
                    id: projectData.id,
                    title: projectData.title,
                    story: projectData.story,
                    hero_image: projectData.hero_image,
                    slug: projectData.slug,
                    created_at: projectData.created_at
                });
            }
        }

        return projects;
    });
}

export async function getPortfolioItem(slug) {
    const redis = await getRedisClient();

    // Get project ID by slug
    const projectId = await redis.get(`slug:${slug}`);
    if (!projectId) return null;

    // Get project data
    const projectData = await redis.hGetAll(`project:${projectId}`);
    if (!projectData.id) return null;

    const project = {
        id: projectData.id,
        title: projectData.title,
        story: projectData.story,
        hero_image: projectData.hero_image,
        slug: projectData.slug,
        created_at: projectData.created_at
    };

    // Get project photos
    const photoIds = await redis.lRange(`project:${projectId}:photos`, 0, -1);
    const photos = [];
    for (const photoId of photoIds) {
        const photoData = await redis.hGetAll(`photo:${photoId}`);
        if (photoData.id) {
            photos.push({
                id: photoData.id,
                project_id: photoData.project_id,
                image_path: photoData.image_path,
                created_at: photoData.created_at
            });
        }
    }
    project.photos = photos;

    return project;
}

export async function getPortfolioItemById(id) {
    const redis = await getRedisClient();

    // Get project data
    const projectData = await redis.hGetAll(`project:${id}`);
    if (!projectData.id) return null;

    const project = {
        id: projectData.id,
        title: projectData.title,
        story: projectData.story,
        hero_image: projectData.hero_image,
        slug: projectData.slug,
        created_at: projectData.created_at
    };

    // Get project photos
    const photoIds = await redis.lRange(`project:${id}:photos`, 0, -1);
    const photos = [];
    for (const photoId of photoIds) {
        const photoData = await redis.hGetAll(`photo:${photoId}`);
        if (photoData.id) {
            photos.push({
                id: photoData.id,
                project_id: photoData.project_id,
                image_path: photoData.image_path,
                created_at: photoData.created_at
            });
        }
    }
    project.photos = photos;

    return project;
}

export async function createPortfolioItem(data) {
    const redis = await getRedisClient();
    const { title, story, hero_image, slug, photos } = data;

    const projectId = generateId();
    const createdAt = new Date().toISOString();

    // Check if slug already exists
    const existingProject = await redis.get(`slug:${slug}`);
    if (existingProject) {
        throw new Error('Slug already exists');
    }

    // Store project data
    await redis.hSet(`project:${projectId}`, {
        id: projectId,
        title,
        story: story || '',
        hero_image: hero_image || '',
        slug,
        created_at: createdAt
    });

    // Add to sorted set for ordering (using timestamp as score)
    await redis.zAdd('projects:sorted', {
        score: Date.now(),
        value: projectId
    });

    // Create slug lookup
    await redis.set(`slug:${slug}`, projectId);

    // Add gallery photos if provided
    if (photos && photos.length > 0) {
        for (const imagePath of photos) {
            const photoId = generateId();
            await redis.hSet(`photo:${photoId}`, {
                id: photoId,
                project_id: projectId,
                image_path: imagePath,
                created_at: new Date().toISOString()
            });
            await redis.lPush(`project:${projectId}:photos`, photoId);
        }
    }

    return { lastID: projectId };
}

export async function submitContact(data) {
    const redis = await getRedisClient();
    const { name, email, phone, message, project_type, location, budget_range } = data;

    const contactId = generateId();
    const createdAt = new Date().toISOString();

    // Store contact data
    await redis.hSet(`contact:${contactId}`, {
        id: contactId,
        name,
        email,
        phone: phone || '',
        message,
        project_type: project_type || '',
        location: location || '',
        budget_range: budget_range || '',
        created_at: createdAt,
        status: 'new'
    });

    // Add to sorted set for ordering
    await redis.zAdd('contacts:sorted', {
        score: Date.now(),
        value: contactId
    });

    return { lastID: contactId };
}

export async function getContacts() {
    const redis = await getRedisClient();

    // Get all contact IDs
    const contactIds = await redis.zRange('contacts:sorted', 0, -1, { REV: true });

    if (!contactIds.length) return [];

    // Get all contact data
    const contacts = [];
    for (const id of contactIds) {
        const contactData = await redis.hGetAll(`contact:${id}`);
        if (contactData.id) {
            contacts.push({
                id: contactData.id,
                name: contactData.name,
                email: contactData.email,
                phone: contactData.phone,
                message: contactData.message,
                project_type: contactData.project_type,
                location: contactData.location,
                budget_range: contactData.budget_range,
                created_at: contactData.created_at,
                status: contactData.status
            });
        }
    }

    return contacts;
}

export async function deleteContact(contactId) {
    const redis = await getRedisClient();

    // Remove from hash
    await redis.del(`contact:${contactId}`);

    // Remove from sorted set
    await redis.zRem('contacts:sorted', contactId);

    return true;
}

// Admin functions for project management
export async function updateProject(id, data) {
    const redis = await getRedisClient();
    const { title, story, slug, hero_image } = data;

    // Check if project exists
    const existingProject = await redis.hGetAll(`project:${id}`);
    if (!existingProject.id) {
        throw new Error('Project not found');
    }

    // If slug is changing, check if new slug already exists
    if (slug !== existingProject.slug) {
        const existingSlugProject = await redis.get(`slug:${slug}`);
        if (existingSlugProject && existingSlugProject !== id) {
            throw new Error('Slug already exists');
        }

        // Remove old slug mapping and create new one
        await redis.del(`slug:${existingProject.slug}`);
        await redis.set(`slug:${slug}`, id);
    }

    // Update project data
    await redis.hSet(`project:${id}`, {
        id,
        title,
        story: story || '',
        slug,
        hero_image: hero_image || '',
        created_at: existingProject.created_at // Preserve original creation date
    });

    return { changes: 1 };
}

export async function deleteProject(id) {
    const redis = await getRedisClient();

    // Get project data to remove slug mapping
    const projectData = await redis.hGetAll(`project:${id}`);
    if (!projectData.id) {
        throw new Error('Project not found');
    }

    // Delete related photos first
    const photoIds = await redis.lRange(`project:${id}:photos`, 0, -1);
    for (const photoId of photoIds) {
        await redis.del(`photo:${photoId}`);
    }
    await redis.del(`project:${id}:photos`);

    // Remove from sorted set
    await redis.zRem('projects:sorted', id);

    // Remove slug mapping
    await redis.del(`slug:${projectData.slug}`);

    // Delete the project
    await redis.del(`project:${id}`);

    return { changes: 1 };
}

export async function addProjectPhoto(projectId, imagePath) {
    const redis = await getRedisClient();

    // Check if project exists
    const projectExists = await redis.exists(`project:${projectId}`);
    if (!projectExists) {
        throw new Error('Project not found');
    }

    const photoId = generateId();

    await redis.hSet(`photo:${photoId}`, {
        id: photoId,
        project_id: projectId,
        image_path: imagePath,
        created_at: new Date().toISOString()
    });

    await redis.lPush(`project:${projectId}:photos`, photoId);

    return { lastID: photoId };
}

export async function deleteProjectPhoto(photoId) {
    const redis = await getRedisClient();

    // Get photo data to find project ID
    const photoData = await redis.hGetAll(`photo:${photoId}`);
    if (!photoData.id) {
        throw new Error('Photo not found');
    }

    // Remove from project's photo list
    await redis.lRem(`project:${photoData.project_id}:photos`, 0, photoId);

    // Delete the photo
    await redis.del(`photo:${photoId}`);

    return { changes: 1 };
}

export async function updateProjectPhotos(projectId, photos) {
    const redis = await getRedisClient();

    // Check if project exists
    const projectExists = await redis.exists(`project:${projectId}`);
    if (!projectExists) {
        throw new Error('Project not found');
    }

    // Remove existing photos
    const existingPhotoIds = await redis.lRange(`project:${projectId}:photos`, 0, -1);
    for (const photoId of existingPhotoIds) {
        await redis.del(`photo:${photoId}`);
    }
    await redis.del(`project:${projectId}:photos`);

    // Add new photos
    for (const photo of photos) {
        const photoId = generateId();
        await redis.hSet(`photo:${photoId}`, {
            id: photoId,
            project_id: projectId,
            image_path: photo.image_path,
            created_at: new Date().toISOString()
        });
        await redis.lPush(`project:${projectId}:photos`, photoId);
    }

    return { changes: photos.length };
}
