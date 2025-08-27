import { updateProject, updateProjectPhotos, deleteProject } from '../../../../lib/database';
import { requireAuth } from '../../../../lib/auth';

async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        // Update project
        try {
            const { title, story, slug, hero_image, gallery_images } = req.body;

            // Validate required fields
            if (!title || !story || !slug) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Update project basic info
            await updateProject(id, { title, story, slug, hero_image });

            // Update gallery images if provided
            if (gallery_images) {
                await updateProjectPhotos(id, gallery_images);
            }

            res.status(200).json({ message: 'Project updated successfully' });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'DELETE') {
        // Delete project
        try {
            await deleteProject(id);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default requireAuth(handler);
