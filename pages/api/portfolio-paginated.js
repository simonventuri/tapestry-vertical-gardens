// API endpoint for paginated portfolio page
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { page = 1, limit = 4 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Get paginated projects - only visible ones for frontend
        const { getVisiblePortfolioItemsPaginated } = await import('../../lib/database');
        const result = await getVisiblePortfolioItemsPaginated(pageNumber, limitNumber);

        // Set cache headers for better performance
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching paginated portfolio:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
