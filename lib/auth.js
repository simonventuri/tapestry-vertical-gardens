export function checkAuth(req) {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.admin_token || req.headers.authorization?.replace('Bearer ', '');

    // In a real implementation, you'd validate the token properly
    // For this simple implementation, just check if token exists
    return !!token;
}

export function requireAuth(handler) {
    return async (req, res) => {
        if (!checkAuth(req)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        return handler(req, res);
    };
}
