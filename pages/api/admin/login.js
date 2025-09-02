const tokenManager = require('../../../lib/tokenManager');

// Simple hardcoded credentials - in production, use environment variables and proper hashing
const ADMIN_USERNAME = 'joey_deacon';
const ADMIN_PASSWORD = 'spazzmatron2025';

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    // Simple credential check
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create token using token manager
        const token = tokenManager.createToken(username);

        // Set a cookie with the token (expires in 24 hours)
        res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);

        return res.status(200).json({
            success: true,
            token,
            message: 'Login successful'
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
}
