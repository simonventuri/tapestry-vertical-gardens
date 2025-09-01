import { reorderProjects } from '../../../lib/database';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check authentication
    const token = req.cookies?.admin_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { orderedIds } = req.body;

        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({ error: 'orderedIds must be an array' });
        }

        await reorderProjects(orderedIds);

        res.status(200).json({ message: 'Projects reordered successfully' });
    } catch (error) {
        console.error('Reorder error:', error);
        res.status(500).json({ error: 'Failed to reorder projects' });
    }
}
