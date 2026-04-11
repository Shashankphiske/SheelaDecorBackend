import type { Request } from "express"
import { logger } from "./logger.util.js";
import { redis } from "../config/redis.js";
import crypto from "crypto";

class RedisUtils {
    generateKey = (req: Request, type: string): string => {
        const userId = type === "PRIVATE" ? req.user?.role === "ADMIN" ? "ADMIN" : req.user?.id : "PUBLIC";

        const resource = (req.baseUrl.split("/").pop() || "GLOBAL").toUpperCase();
        const sortedQuery = Object.keys(req.query).sort().map(key => `${key.toLocaleLowerCase()}=${String(req.query[key])}`).join("&");
        const path = req.path.replace(/\/&/, "");

        return `v1:cache:${userId}:${resource}:${path}:${sortedQuery ? "?" + sortedQuery : ""}`;
    }

    invalidateKey = async (userId: string, resource: string, action: string) => {
        const normalizedResource = resource.toUpperCase();
        const pattern = `v1:cache:${userId}:${normalizedResource}:*`;

        try {
            const stream = redis.scanStream({
                match: pattern,
                count: 100,
            });

            stream.on("data", async (keys: string[]) => {
                if (keys.length > 0) {
                    await redis.del(...keys);
                }
            });

            stream.on("end", () => {
                logger.info("Redis cache invalidation completed", {
                    pattern,
                    resource: normalizedResource,
                    userId,
                    action
                });
            });

            stream.on("error", (err) => {
                throw err;
            });

        } catch (err: any) {
            logger.error("Error while invalidating redis keys", {
                message: err.message,
                resource: normalizedResource
            });
        }
    };

    generatePayloadHash = (req: Request) => {
        crypto.createHash('sha256').update(JSON.stringify({
            body: req.body,
            url: req.originalUrl,
            method: req.method
        })).digest("hex");
    }
}

export { RedisUtils }