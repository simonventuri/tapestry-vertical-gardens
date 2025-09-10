import { verifyToken } from '../../../lib/auth';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.cookies.admin_token;

        if (!token) {
            console.log('No token provided for verification');
            return res.status(401).json({ error: 'No token provided' });
        }

        // Validate the token using JWT
        const decoded = verifyToken(token);

        if (!decoded) {
            console.log('Token verification failed');
            // Clear the invalid cookie
            res.setHeader('Set-Cookie', [
                'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
            ]);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        console.log('Token verified successfully for user:', decoded.username);
        return res.status(200).json({
            authenticated: true,
            user: {
                username: decoded.username,
                role: decoded.role || 'admin'
            }
        });
    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
}