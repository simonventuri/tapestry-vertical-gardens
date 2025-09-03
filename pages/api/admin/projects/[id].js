import { updateProject, deleteProject } from '../../../../lib/database';
import { requireAuth } from '../../../../lib/auth';
import { processProjectImages } from '../../../../lib/imageUtils';

// Increase body size limit for image uploads
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'PUT') {
        // Update project
        try {
            const { title, description, slug, category, location, year, size, images, features, plants } = req.body;

            // Validate required fields
            if (!title || !description || !slug) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Get existing project data to handle image updates
            const redis = await (await import('../../../../lib/database')).getRedisClient();
            const existingProject = await redis.hGetAll(`portfolio:${id}`);

            if (!existingProject.id) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Process new/updated images - optimize base64 images for storage
            let processedImages = JSON.parse(existingProject.images || '[]');
            if (images !== undefined) {
                processedImages = await processProjectImages(images);
            }

            // Update project with new schema
            const updateResult = await updateProject(id, {
                title,
                description,
                slug,
                category,
                location,
                year,
                size,
                images: processedImages,
                features,
                plants
            });

            res.status(200).json({
                message: 'Project updated successfully',
                slugChanged: updateResult.oldSlug !== updateResult.newSlug,
                oldSlug: updateResult.oldSlug,
                newSlug: updateResult.newSlug
            });
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
