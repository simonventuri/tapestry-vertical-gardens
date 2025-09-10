import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-12345';

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}

export function createToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function requireAuth(handler) {
    return async (req, res) => {
        try {
            const token = req.cookies.admin_token;

            if (!token) {
                console.log('No token provided in cookies');
                return res.status(401).json({ error: 'No token provided' });
            }

            // Use JWT for token validation instead of in-memory storage
            const decoded = verifyToken(token);

            if (!decoded) {
                console.log('Invalid or expired token');
                // Clear the invalid cookie
                res.setHeader('Set-Cookie', [
                    'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
                ]);
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // Add user info to request
            req.user = { role: 'admin', username: decoded.username };

            return handler(req, res);
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ error: 'Authentication failed' });
        }
    };
}
