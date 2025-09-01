import { getRedisClient } from '../../lib/database';

export default async function handler(req, res) {
    // Only allow POST requests for security
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Optional: Add a secret key for security
    const seedSecret = process.env.SEED_SECRET || 'your-secret-key';
    if (req.body.secret !== seedSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const redis = await getRedisClient();

        // Clear existing data
        await redis.flushDb();

        // Seed portfolio items
        const portfolioItems = [
            {
                id: '1756700073177wqqj4id64',
                slug: 'belsize-avenue',
                title: 'Belsize Avenue',
                description: 'A stunning residential living wall installation in London featuring native British plants and automated irrigation.',
                category: 'Residential',
                location: 'London, UK',
                year: '2023',
                images: [
                    '/images/belsize-avenue-living-wall-london.jpg'
                ],
                size: '4m x 2.5m',
            },
            {
                id: '1756700074285kx9p8lm23',
                slug: 'bio-sphere',
                title: 'Bio-Sphere',
                description: 'An artistic vertical garden installation combining modern design with sustainable plant cultivation.',
                category: 'Artistic',
                location: 'Chelsea, London',
                year: '2023',
                images: [
                    '/images/bio-sphere-living-sculpture.jpg'
                ],
                size: '3m x 3m x 2m',
            },
            {
                id: '1756700076441mt8k5qr67',
                slug: 'eaton-square',
                title: 'Eaton Square',
                description: 'Luxurious vertical garden installation in prestigious Eaton Square, featuring rare and exotic plant species.',
                category: 'Luxury Residential',
                location: 'Belgravia, London',
                year: '2024',
                images: [
                    '/images/eaton-square-vertical-garden-london.jpg'
                ],
                size: '5m x 3m',
            },
            {
                id: '1756700077598bv2x9nh45',
                slug: 'kings-road',
                title: 'Kings Road',
                description: 'Large-scale commercial living wall installation on Kings Road, designed to improve air quality and create a green urban oasis.',
                category: 'Commercial',
                location: 'Kings Road, London',
                year: '2024',
                images: [
                    '/images/kings-road-living-wall-commercial.jpg'
                ],
                size: '8m x 3m',
            }
        ];

        // Store each portfolio item
        for (const item of portfolioItems) {
            await redis.hSet(`portfolio:${item.id}`, {
                id: item.id,
                slug: item.slug,
                title: item.title,
                description: item.description,
                category: item.category,
                location: item.location,
                year: item.year,
                images: JSON.stringify(item.images),
                size: item.size,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        // Create portfolio list
        const portfolioIds = portfolioItems.map(item => item.id);
        await redis.sAdd('portfolio:list', portfolioIds);

        // Create slug to ID mapping
        for (const item of portfolioItems) {
            await redis.set(`portfolio:slug:${item.slug}`, item.id);
        }

        console.log('Database seeded successfully with', portfolioItems.length, 'portfolio items');

        res.status(200).json({
            message: 'Database seeded successfully',
            itemsSeeded: portfolioItems.length,
            items: portfolioItems.map(item => ({ id: item.id, title: item.title, slug: item.slug }))
        });

    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({
            error: 'Failed to seed database',
            details: error.message
        });
    }
}
