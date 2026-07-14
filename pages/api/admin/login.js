import { createToken } from '../../../lib/auth';

// Admin credentials are configured via environment variables (see .env.example)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
        console.error('ADMIN_USERNAME / ADMIN_PASSWORD environment variables are not set');
        return res.status(500).json({ error: 'Server not configured for authentication' });
    }

    const { username, password } = req.body;

    // Credential check against configured environment variables
    const isValidCredentials = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

    if (!isValidCredentials) {
        console.log('Invalid credentials attempted:', username);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
        // Create a JWT token with user information
        const token = createToken({
            username: username,
            role: 'admin',
            loginTime: Date.now()
        });

        // Set secure HTTP-only cookie with consistent options
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

        console.log('Login successful for user:', username);
        return res.status(200).json({
            message: 'Login successful',
            user: { username, role: 'admin' }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed' });
    }
}