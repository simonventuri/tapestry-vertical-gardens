const tokenManager = require('../../../lib/tokenManager');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get token from cookie
        const cookies = req.headers.cookie || '';
        const tokenMatch = cookies.match(/admin_token=([^;]+)/);

        if (!tokenMatch) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = tokenMatch[1];

        // Validate token using token manager
        if (!tokenManager.validateToken(token)) {
            return res.status(401).json({
                success: false,
                message: 'Token expired or invalid'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Token valid'
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
