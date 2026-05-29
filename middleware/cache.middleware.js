import { redisUtils } from "../factory/utils.factory.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { redis } from "../config/redis.js";
class CacheMiddleware {
    client;
    constructor(client) {
        this.client = client;
    }
    cacheRequest = (ttl, type = "PUBLIC") => {
        return async (req, res, next) => {
            if (req.method !== "GET") {
                return next();
            }
            const key = redisUtils.generateKey(req, type);
            try {
                const cachedResponse = await this.client.get(key);
                if (cachedResponse) {
                    logger.info("Cache 'Hit' for key", {
                        key
                    });
                    return res.json(JSON.parse(cachedResponse));
                }
                logger.info("Cache 'Miss' for key", {
                    key
                });
                const originalJson = res.json.bind(res);
                res.json = (body) => {
                    // Set the cache and continue with original response
                    this.client.setex(key, ttl, JSON.stringify(body));
                    return originalJson(body);
                };
                return next();
            }
            catch (err) {
                throw new ServerError(err);
            }
        };
    };
}
const cacheMiddleware = new CacheMiddleware(redis);
export { cacheMiddleware };
//# sourceMappingURL=cache.middleware.js.map