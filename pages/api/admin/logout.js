export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Clear the authentication cookie
        res.setHeader('Set-Cookie', [
            'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict',
            `admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Domain=${req.headers.host}`
        ]);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}