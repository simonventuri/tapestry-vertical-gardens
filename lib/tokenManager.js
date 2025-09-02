const crypto = require('crypto');

// Simple in-memory token storage
// In production, use Redis or a database
class TokenManager {
    constructor() {
        this.tokens = new Map();

        // Clean up expired tokens every hour
        setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);
    }

    createToken(username) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours

        this.tokens.set(token, { expires, username });
        return token;
    }

    validateToken(token) {
        if (!token) return false;

        const tokenData = this.tokens.get(token);
        if (!tokenData) return false;

        if (tokenData.expires < Date.now()) {
            this.tokens.delete(token);
            return false;
        }

        return true;
    }

    revokeToken(token) {
        if (token) {
            this.tokens.delete(token);
        }
    }

    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, data] of this.tokens.entries()) {
            if (data.expires < now) {
                this.tokens.delete(token);
            }
        }
    }
}

// Create a singleton instance
const tokenManager = new TokenManager();

module.exports = tokenManager;
