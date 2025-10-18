import { requireAuth } from '../../../lib/auth';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const diagnostics = {
            timestamp: new Date().toISOString(),
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                hasRedisPassword: !!process.env.REDIS_PASSWORD,
                hasJwtSecret: !!process.env.JWT_SECRET,
                hasSessionSecret: !!process.env.SESSION_SECRET,
            },
            auth: {
                userInfo: req.user || 'No user info',
                tokenPresent: !!req.cookies.admin_token,
            }
        };

        // Test Redis connection
        try {
            const { getRedisClient } = await import('../../../lib/database');
            const redis = await getRedisClient();

            // Simple Redis test
            await redis.ping();
            diagnostics.redis = {
                status: 'connected',
                message: 'Redis connection successful'
            };

            // Test basic Redis operations
            const testKey = `diagnostic:${Date.now()}`;
            await redis.set(testKey, 'test-value', { EX: 10 });
            const testValue = await redis.get(testKey);
            await redis.del(testKey);

            diagnostics.redis.operationsTest = testValue === 'test-value' ? 'passed' : 'failed';

        } catch (redisError) {
            diagnostics.redis = {
                status: 'error',
                message: redisError.message,
                code: redisError.code
            };
        }

        res.status(200).json(diagnostics);

    } catch (error) {
        console.error('Diagnostic error:', error);
        res.status(500).json({
            error: 'Diagnostic failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
}

export default requireAuth(handler);