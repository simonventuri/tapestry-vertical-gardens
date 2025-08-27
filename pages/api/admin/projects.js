import { createPortfolioItem, deleteProject } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method === 'POST') {
        // Create new project
        try {
            const { title, story, slug, hero_image, gallery_images } = req.body;

            // Validate required fields
            if (!title || !story || !slug) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Create the project
            const projectData = {
                title,
                story,
                slug,
                hero_image: hero_image || '',
                photos: gallery_images || []
            };

            const result = await createPortfolioItem(projectData);

            res.status(201).json({
                message: 'Project created successfully',
                projectId: result.lastID
            });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default requireAuth(handler);
