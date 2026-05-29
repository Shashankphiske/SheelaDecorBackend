import { Redis } from "ioredis";
import { ServerError } from "../utils/error.utils.js";
import { config } from "./index.js";
import { logger } from "../utils/logger.util.js";
let redis;
try {
    redis = new Redis(config.redisUrl, {
        connectTimeout: 10000,
        maxRetriesPerRequest: 1
    });
    redis.on("connect", () => logger.info("Redis connected to upstash"));
    redis.on("error", () => logger.error("Redis error"));
}
catch (err) {
    throw new ServerError(err);
}
export { redis };
//# sourceMappingURL=redis.js.map