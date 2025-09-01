import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { getRedisClient } = await import('../../../lib/database');
        const redis = await getRedisClient();

        // Get all projects from the sorted set
        const sortedProjects = await redis.zRevRange('projects:sorted', 0, -1);
        console.log('Projects in sorted set:', sortedProjects);

        // Get current portfolio list
        const portfolioList = await redis.sMembers('portfolio:list');
        console.log('Projects in portfolio list:', portfolioList);

        // Add missing projects to portfolio list
        const added = [];
        for (const projectId of sortedProjects) {
            if (!portfolioList.includes(projectId)) {
                await redis.sAdd('portfolio:list', projectId);
                added.push(projectId);
                console.log(`Added ${projectId} to portfolio:list`);
            }
        }

        // Also check for any portfolio:* keys that might exist
        const portfolioKeys = await redis.keys('portfolio:*');
        const portfolioProjects = portfolioKeys
            .filter(key => key.match(/^portfolio:[a-zA-Z0-9]+$/)) // Match portfolio:id pattern
            .map(key => key.replace('portfolio:', ''));

        for (const projectId of portfolioProjects) {
            if (!portfolioList.includes(projectId) && !added.includes(projectId)) {
                await redis.sAdd('portfolio:list', projectId);
                added.push(projectId);
                console.log(`Added ${projectId} to portfolio:list from portfolio keys`);
            }
        }

        res.status(200).json({
            message: 'Migration completed',
            sortedProjectsCount: sortedProjects.length,
            portfolioListCount: portfolioList.length,
            addedProjects: added,
            portfolioKeys: portfolioKeys.length
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ message: 'Migration failed', error: error.message });
    }
}

export default requireAuth(handler);
