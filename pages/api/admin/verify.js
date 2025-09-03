import tokenManager from '../../../lib/tokenManager';

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.cookies.admin_token;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Validate the token using token manager
        const isValid = tokenManager.validateToken(token);

        if (!isValid) {
            // Clear the invalid cookie
            res.setHeader('Set-Cookie', [
                'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
            ]);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        return res.status(200).json({
            authenticated: true,
            user: { role: 'admin' }
        });
    } catch (error) {
        console.error('Verify error:', error);
        return res.status(500).json({ error: 'Verification failed' });
    }
}
