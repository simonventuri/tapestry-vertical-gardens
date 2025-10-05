// Remote Redis connection (your current Vercel setup)
const remoteRedis = createClient({
    url: process.env.REMOTE_REDIS_URL, // Your current Vercel Redis URL
    socket: {
        tls: process.env.REMOTE_REDIS_URL.includes('rediss://'),
        rejectUnauthorized: false
    }
});

// Local Redis connection
const localRedis = createClient({
    socket: {
        host: 'localhost',
        port: 6379,
    },
    password: process.env.REDIS_PASSWORD,
});

async function migrateData() {
    try {
        console.log('Connecting to Redis instances...');
        await remoteRedis.connect();
        await localRedis.connect();

        console.log('Starting migration...');

        // Get all keys from remote
        const keys = await remoteRedis.keys('*');
        console.log(`Found ${keys.length} keys to migrate`);

        for (const key of keys) {
            console.log(`Migrating key: ${key}`);

            const type = await remoteRedis.type(key);

            switch (type) {
                case 'string':
                    const value = await remoteRedis.get(key);
                    await localRedis.set(key, value);
                    break;

                case 'hash':
                    const hash = await remoteRedis.hGetAll(key);
                    await localRedis.hSet(key, hash);
                    break;

                case 'list':
                    const list = await remoteRedis.lRange(key, 0, -1);
                    await localRedis.del(key);
                    if (list.length > 0) {
                        await localRedis.rPush(key, list);
                    }
                    break;

                case 'set':
                    const set = await remoteRedis.sMembers(key);
                    await localRedis.del(key);
                    if (set.length > 0) {
                        await localRedis.sAdd(key, set);
                    }
                    break;

                case 'zset':
                    const zset = await remoteRedis.zRangeWithScores(key, 0, -1);
                    await localRedis.del(key);
                    if (zset.length > 0) {
                        await localRedis.zAdd(key, zset);
                    }
                    break;

                default:
                    console.log(`Skipping key ${key} with unsupported type: ${type}`);
            }

            // Copy TTL if it exists
            const ttl = await remoteRedis.ttl(key);
            if (ttl > 0) {
                await localRedis.expire(key, ttl);
            }
        }

        console.log('Migration completed successfully!');

        // Verify migration
        const localKeys = await localRedis.keys('*');
        console.log(`Local Redis now has ${localKeys.length} keys`);

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await remoteRedis.quit();
        await localRedis.quit();
    }
}

migrateData();