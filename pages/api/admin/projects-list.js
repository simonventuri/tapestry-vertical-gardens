import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get projects with minimal data for admin list view
        const { getPortfolioItemsForAdmin } = await import('../../../lib/database');
        const projects = await getPortfolioItemsForAdmin();

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default requireAuth(handler);
