// Debug API to check slug mappings
import { getRedisClient } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const redis = await getRedisClient();
        const { slug } = req.query;

        if (slug) {
            // Check specific slug
            const projectId = await redis.get(`portfolio:slug:${slug}`);
            const projectData = projectId ? await redis.hGetAll(`portfolio:${projectId}`) : null;

            return res.json({
                slug,
                projectId,
                projectExists: !!projectData?.id,
                projectData: projectData || null
            });
        } else {
            // List all slug mappings
            const keys = await redis.keys('portfolio:slug:*');
            const mappings = {};

            for (const key of keys) {
                const slug = key.replace('portfolio:slug:', '');
                const projectId = await redis.get(key);
                mappings[slug] = projectId;
            }

            return res.json({
                slugMappings: mappings,
                totalMappings: Object.keys(mappings).length
            });
        }
    } catch (error) {
        console.error('Error checking slug mappings:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export default requireAuth(handler);
