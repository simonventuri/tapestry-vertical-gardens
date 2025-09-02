// API endpoint for portfolio page
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get optimized projects for portfolio display
        const { getPortfolioItemsOptimized } = await import('../../lib/database');
        const projects = await getPortfolioItemsOptimized();

        // Set cache headers for better performance
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching portfolio items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
