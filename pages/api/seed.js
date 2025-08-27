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
                id: '1',
                slug: 'belsize-avenue-living-wall',
                title: 'Belsize Avenue Living Wall',
                description: 'A stunning residential living wall installation in London featuring native British plants and automated irrigation.',
                category: 'Residential',
                location: 'London, UK',
                year: '2023',
                images: [
                    '/images/belsize-avenue-living-wall-london.jpg',
                    '/images/belsize-avenue-living-wall-london.png'
                ],
                features: [
                    'Native British plants',
                    'Automated irrigation system',
                    'LED grow lights',
                    'Modular design'
                ],
                size: '4m x 2.5m',
                plants: ['Ferns', 'Moss', 'Ivy', 'Native grasses']
            },
            {
                id: '2',
                slug: 'bio-sphere-living-sculpture',
                title: 'Bio-Sphere Living Sculpture',
                description: 'An artistic vertical garden installation combining modern design with sustainable plant cultivation.',
                category: 'Artistic',
                location: 'Chelsea, London',
                year: '2023',
                images: [
                    '/images/bio-sphere-living-sculpture.jpg',
                    '/images/bio-sphere-living-sculpture.png'
                ],
                features: [
                    'Sculptural design',
                    'Air purifying plants',
                    'Integrated water feature',
                    'Smart monitoring system'
                ],
                size: '3m x 3m x 2m',
                plants: ['Air plants', 'Succulents', 'Tropical varieties']
            },
            {
                id: '3',
                slug: 'devon-nursery-vertical-gardens',
                title: 'Devon Nursery Vertical Gardens',
                description: 'Commercial vertical garden installation for a plant nursery, showcasing various plant species and growing techniques.',
                category: 'Commercial',
                location: 'Devon, UK',
                year: '2024',
                images: [
                    '/images/devon-nursery-vertical-gardens.jpg',
                    '/images/devon-nursery-vertical-gardens.png'
                ],
                features: [
                    'Educational display',
                    'Multiple growing systems',
                    'Seasonal plant rotation',
                    'Visitor interaction areas'
                ],
                size: '6m x 4m',
                plants: ['Herbs', 'Vegetables', 'Ornamental plants', 'Climbing vines']
            },
            {
                id: '4',
                slug: 'eaton-square-vertical-garden',
                title: 'Eaton Square Vertical Garden',
                description: 'Luxurious vertical garden installation in prestigious Eaton Square, featuring rare and exotic plant species.',
                category: 'Luxury Residential',
                location: 'Belgravia, London',
                year: '2024',
                images: [
                    '/images/eaton-square-vertical-garden-london.jpg',
                    '/images/eaton-square-vertical-garden-london.png'
                ],
                features: [
                    'Rare plant species',
                    'Climate control system',
                    'Architectural integration',
                    'Maintenance service included'
                ],
                size: '5m x 3m',
                plants: ['Orchids', 'Rare ferns', 'Exotic bromeliads', 'Climbing jasmine']
            },
            {
                id: '5',
                slug: 'kings-road-living-wall-commercial',
                title: 'Kings Road Living Wall Commercial',
                description: 'Large-scale commercial living wall installation on Kings Road, designed to improve air quality and create a green urban oasis.',
                category: 'Commercial',
                location: 'Kings Road, London',
                year: '2024',
                images: [
                    '/images/kings-road-living-wall-commercial.jpg',
                    '/images/kings-road-living-wall-commercial.png'
                ],
                features: [
                    'Air purification system',
                    'Weather-resistant design',
                    'Low maintenance plants',
                    'Public accessibility'
                ],
                size: '8m x 3m',
                plants: ['Hardy perennials', 'Native climbers', 'Evergreen shrubs', 'Seasonal flowers']
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
                features: JSON.stringify(item.features),
                size: item.size,
                plants: JSON.stringify(item.plants),
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
