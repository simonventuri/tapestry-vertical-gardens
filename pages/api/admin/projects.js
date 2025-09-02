import { createPortfolioItem, deleteProject } from '../../../lib/database';
import { requireAuth } from '../../../lib/auth';
import { processProjectImages, deleteProjectImages } from '../../../lib/imageUtils';

// Increase body size limit for image uploads
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

async function handler(req, res) {
    if (req.method === 'POST') {
        // Create new project
        try {
            const { title, description, slug, category, location, year, size, images, features, plants } = req.body;

            // Validate required fields
            if (!title || !description || !slug) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Process images - convert base64 to disk storage
            const processedImages = await processProjectImages(images || [], slug);

            // Create the project with new unified structure
            const projectData = {
                title,
                description,
                slug,
                category: category || '',
                location: location || '',
                year: year || '',
                size: size || '',
                images: processedImages,
                features: features || [],
                plants: plants || []
            };

            const result = await createPortfolioItem(projectData);

            // Trigger ISR revalidation for portfolio and new project pages
            try {
                await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/portfolio`, {
                    method: 'POST'
                });
                await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/revalidate?secret=${process.env.REVALIDATE_SECRET}&path=/projects/${projectData.slug}`, {
                    method: 'POST'
                });
                console.log('ISR revalidation triggered for new project');
            } catch (revalidateError) {
                console.error('Failed to trigger revalidation:', revalidateError);
                // Don't fail the request if revalidation fails
            }

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
