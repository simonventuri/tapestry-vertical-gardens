// API endpoint for paginated portfolio page
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { page = 1, limit = 4 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Get optimized projects for portfolio display
        const { getPortfolioItemsOptimized } = await import('../../lib/database');
        const allProjects = await getPortfolioItemsOptimized();

        // Calculate pagination
        const totalProjects = allProjects.length;
        const totalPages = Math.ceil(totalProjects / limitNumber);
        const startIndex = (pageNumber - 1) * limitNumber;
        const endIndex = startIndex + limitNumber;
        const projects = allProjects.slice(startIndex, endIndex);

        // Set cache headers for better performance
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
        res.status(200).json({
            projects,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalProjects,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });
    } catch (error) {
        console.error('Error fetching paginated portfolio:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
