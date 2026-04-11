import { Redis } from "ioredis";
import { ServerError } from "../utils/error.utils.js";
import { config } from "./index.js";
import { logger } from "../utils/logger.util.js";

let redis: Redis;

try {
    redis = new Redis(config.redisUrl as string, {
        connectTimeout: 10000,
        maxRetriesPerRequest: 1
    });

    redis.on("connect", () => logger.info("Redis connected to upstash"));
    redis.on("error", () => logger.error("Redis error"));
}catch(err: any) {
    throw new ServerError(err);
}

export { redis };