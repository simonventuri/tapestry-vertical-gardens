import jwt from 'jsonwebtoken';
import tokenManager from './tokenManager';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
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
                return res.status(401).json({ error: 'No token provided' });
            }

            // Use the token manager for proper validation
            const isValid = tokenManager.validateToken(token);

            if (!isValid) {
                // Clear the invalid cookie
                res.setHeader('Set-Cookie', 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict');
                return res.status(401).json({ error: 'Invalid or expired token' });
            }

            // Add user info to request
            req.user = { role: 'admin' };

            return handler(req, res);
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ error: 'Authentication failed' });
        }
    };
}
