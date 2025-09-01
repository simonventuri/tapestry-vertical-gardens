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
        // Get ordered project IDs from the sorted set (if exists), fallback to portfolio set
        let projectIds;
        const orderedExists = await redis.exists('portfolio:ordered');

        if (orderedExists) {
            // Get IDs in order from sorted set (ascending by order value)
            projectIds = await redis.zRange('portfolio:ordered', 0, -1);
        } else {
            // Fallback to regular set
            projectIds = await redis.sMembers('portfolio:list');
        }

        if (!projectIds.length) return [];

        // Get all project data
        const projects = [];
        for (const id of projectIds) {
            const projectData = await redis.hGetAll(`portfolio:${id}`);
            if (projectData.id) {
                const images = JSON.parse(projectData.images || '[]');
                projects.push({
                    id: projectData.id,
                    title: projectData.title,
                    description: projectData.description,
                    category: projectData.category,
                    location: projectData.location,
                    year: projectData.year,
                    size: projectData.size,
                    slug: projectData.slug,
                    hero_image: images.length > 0 ? images[0] : null,
                    images: images,
                    features: JSON.parse(projectData.features || '[]'),
                    plants: JSON.parse(projectData.plants || '[]'),
                    createdAt: projectData.createdAt || projectData.created_at || new Date().toISOString(),
                    updatedAt: projectData.updatedAt || projectData.updated_at
                });
            }
        }

        // If no ordered set exists, sort by creation date and initialize order
        if (!orderedExists && projects.length > 0) {
            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            // Initialize the ordered set
            const orderPromises = projects.map((project, index) =>
                redis.zAdd('portfolio:ordered', { score: index, value: project.id })
            );
            await Promise.all(orderPromises);
        }

        return projects;
    });
}

// Optimized function for portfolio page - only returns hero image to reduce payload size
export async function getPortfolioItemsOptimized() {
    return withRedis(async (redis) => {
        // Get ordered project IDs from the sorted set (if exists), fallback to portfolio set
        let projectIds;
        const orderedExists = await redis.exists('portfolio:ordered');

        if (orderedExists) {
            // Get IDs in order from sorted set (ascending by order value)
            projectIds = await redis.zRange('portfolio:ordered', 0, -1);
        } else {
            // Fallback to regular set
            projectIds = await redis.sMembers('portfolio:list');
        }

        if (!projectIds.length) return [];

        // Get all project data but only include hero image
        const projects = [];
        for (const id of projectIds) {
            const projectData = await redis.hGetAll(`portfolio:${id}`);
            if (projectData.id) {
                const images = JSON.parse(projectData.images || '[]');
                projects.push({
                    id: projectData.id,
                    title: projectData.title,
                    description: projectData.description,
                    category: projectData.category,
                    location: projectData.location,
                    year: projectData.year,
                    slug: projectData.slug,
                    hero_image: images.length > 0 ? images[0] : null,
                    createdAt: projectData.createdAt,
                    updatedAt: projectData.updatedAt
                });
            }
        }

        // If no ordered set exists, sort by creation date and initialize order
        if (!orderedExists && projects.length > 0) {
            projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            // Initialize the ordered set
            const orderPromises = projects.map((project, index) =>
                redis.zAdd('portfolio:ordered', { score: index, value: project.id })
            );
            await Promise.all(orderPromises);
        }

        return projects;
    });
}

// Function to reorder projects
export async function reorderProjects(orderedIds) {
    return withRedis(async (redis) => {
        // Clear existing order
        await redis.del('portfolio:ordered');

        // Add projects in new order
        const orderPromises = orderedIds.map((id, index) =>
            redis.zAdd('portfolio:ordered', { score: index, value: id })
        );

        await Promise.all(orderPromises);
        return true;
    });
}

export async function getPortfolioItem(slug) {
    const redis = await getRedisClient();

    // Get project ID by slug
    const projectId = await redis.get(`portfolio:slug:${slug}`);
    if (!projectId) return null;

    // Get project data
    const projectData = await redis.hGetAll(`portfolio:${projectId}`);
    if (!projectData.id) return null;

    const project = {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        location: projectData.location,
        year: projectData.year,
        size: projectData.size,
        slug: projectData.slug,
        images: JSON.parse(projectData.images || '[]'),
        features: JSON.parse(projectData.features || '[]'),
        plants: JSON.parse(projectData.plants || '[]'),
        createdAt: projectData.createdAt,
        updatedAt: projectData.updatedAt
    };

    return project;
}

export async function getPortfolioItemById(id) {
    return withRedis(async (redis) => {
        const projectData = await redis.hGetAll(`portfolio:${id}`);

        if (!projectData.id) return null;

        return {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            category: projectData.category,
            location: projectData.location,
            year: projectData.year,
            size: projectData.size,
            slug: projectData.slug,
            images: JSON.parse(projectData.images || '[]'),
            features: JSON.parse(projectData.features || '[]'),
            plants: JSON.parse(projectData.plants || '[]'),
        };
    });
}

export async function createPortfolioItem(data) {
    const redis = await getRedisClient();
    const { title, description, slug, category, location, year, size, images, features, plants } = data;

    const projectId = generateId();
    const createdAt = new Date().toISOString();

    // Check if slug already exists
    const existingProject = await redis.get(`portfolio:slug:${slug}`);
    if (existingProject) {
        throw new Error('Slug already exists');
    }

    // Helper function to ensure arrays are properly serialized
    const serializeArray = (value, fallback = '[]') => {
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            try {
                // Test if it's already valid JSON
                JSON.parse(value);
                return value;
            } catch {
                // If not valid JSON, treat as empty array
                return fallback;
            }
        }
        return fallback;
    };

    // Store project data with new unified structure (using portfolio: prefix to match updateProject)
    await redis.hSet(`portfolio:${projectId}`, {
        id: projectId,
        title: String(title || ''),
        description: String(description || ''),
        slug: String(slug || ''),
        category: String(category || ''),
        location: String(location || ''),
        year: String(year || ''),
        size: String(size || ''),
        images: serializeArray(images, '[]'),
        features: serializeArray(features, '[]'),
        plants: serializeArray(plants, '[]'),
        created_at: createdAt,
        createdAt: createdAt // Add both for compatibility
    });

    // Add to portfolio list set (required for getPortfolioItems)
    await redis.sAdd('portfolio:list', projectId);

    // Add to ordered set (at the beginning - score 0, then shift others)
    const currentMaxScore = await redis.zCard('portfolio:ordered');
    // Get all current items and increment their scores
    if (currentMaxScore > 0) {
        const allItems = await redis.zRangeWithScores('portfolio:ordered', 0, -1);
        const updatePromises = allItems.map(item =>
            redis.zAdd('portfolio:ordered', { score: item.score + 1, value: item.value })
        );
        await Promise.all(updatePromises);
    }
    // Add new item at position 0
    await redis.zAdd('portfolio:ordered', { score: 0, value: projectId });

    // Create slug lookup with correct pattern
    await redis.set(`portfolio:slug:${slug}`, projectId);
    console.log(`Created slug mapping: portfolio:slug:${slug} -> ${projectId}`);

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
    const { title, description, slug, category, location, year, size, images, features, plants } = data;

    // Check if project exists
    const existingProject = await redis.hGetAll(`portfolio:${id}`);
    if (!existingProject.id) {
        throw new Error('Project not found');
    }

    // Store the old slug to update mappings
    const oldSlug = existingProject.slug;
    const newSlug = String(slug || existingProject.slug || '');

    // Helper function to ensure arrays are properly serialized
    const serializeArray = (value, fallback = '[]') => {
        if (Array.isArray(value)) {
            return JSON.stringify(value);
        }
        if (typeof value === 'string') {
            try {
                // Test if it's already valid JSON
                JSON.parse(value);
                return value;
            } catch {
                // If not valid JSON, treat as empty array
                return fallback;
            }
        }
        return fallback;
    };

    // Update project data with new schema
    const updateData = {
        id: String(id),
        title: String(title || existingProject.title || ''),
        description: String(description || existingProject.description || ''),
        slug: newSlug,
        category: String(category || existingProject.category || ''),
        location: String(location || existingProject.location || ''),
        year: String(year || existingProject.year || ''),
        size: String(size || existingProject.size || ''),
        images: serializeArray(images, existingProject.images || '[]'),
        features: serializeArray(features, existingProject.features || '[]'),
        plants: serializeArray(plants, existingProject.plants || '[]'),
        created_at: String(existingProject.created_at || new Date().toISOString()),
        updatedAt: new Date().toISOString()
    };

    // Update the project data
    await redis.hSet(`portfolio:${id}`, updateData);

    // Update slug mapping if slug has changed
    if (oldSlug && oldSlug !== newSlug) {
        // Remove old slug mapping
        await redis.del(`portfolio:slug:${oldSlug}`);
        console.log(`Removed old slug mapping: portfolio:slug:${oldSlug}`);
    }

    // Set new slug mapping (always set to ensure it exists)
    if (newSlug) {
        await redis.set(`portfolio:slug:${newSlug}`, id);
        console.log(`Created new slug mapping: portfolio:slug:${newSlug} -> ${id}`);
    }

    return { changes: 1, oldSlug, newSlug };
}

export async function deleteProject(id) {
    const redis = await getRedisClient();

    // Get project data to remove slug mapping (using new portfolio: prefix)
    const projectData = await redis.hGetAll(`portfolio:${id}`);
    if (!projectData.id) {
        throw new Error('Project not found');
    }

    // Remove from portfolio list set
    await redis.sRem('portfolio:list', id);

    // Remove from ordered set
    await redis.zRem('portfolio:ordered', id);

    // Remove slug mapping (using new portfolio:slug: pattern)
    if (projectData.slug) {
        await redis.del(`portfolio:slug:${projectData.slug}`);
        console.log(`Removed slug mapping: portfolio:slug:${projectData.slug}`);
    }

    // Delete the project (using new portfolio: prefix)
    await redis.del(`portfolio:${id}`);
    console.log(`Deleted project: portfolio:${id}`);

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
