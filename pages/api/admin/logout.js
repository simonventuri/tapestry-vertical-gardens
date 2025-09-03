import tokenManager from '../../../lib/tokenManager';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const token = req.cookies.admin_token;

        // Revoke the token from memory
        if (token) {
            tokenManager.revokeToken(token);
        }

        // Clear the cookie
        res.setHeader('Set-Cookie', [
            'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
        ]);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            error: 'Logout failed'
        });
    }
}