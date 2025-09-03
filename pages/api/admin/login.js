import tokenManager from '../../../lib/tokenManager';

// Simple hardcoded credentials - in production, use environment variables and proper hashing
const ADMIN_USERNAME = 'joey_deacon';
const ADMIN_PASSWORD = 'spazzmatron2025';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Simple credential check - using hardcoded credentials and environment fallback
    const isValidCredentials = (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) ||
        (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD);

    if (!isValidCredentials) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
        // Create a secure token using the token manager
        const token = tokenManager.createToken(username);

        // Set secure HTTP-only cookie
        const cookieOptions = [
            `admin_token=${token}`,
            'Path=/',
            'HttpOnly',
            'SameSite=Strict',
            `Max-Age=${24 * 60 * 60}`, // 24 hours in seconds
        ];

        // Add Secure flag if in production
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.push('Secure');
        }

        res.setHeader('Set-Cookie', cookieOptions.join('; '));

        return res.status(200).json({
            message: 'Login successful',
            user: { username, role: 'admin' }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
}
