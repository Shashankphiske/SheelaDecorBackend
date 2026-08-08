import { logger } from "../utils/logger.util.js";

// Stub Redis client to avoid actual network/Redis connection in backend
const redis = {
    get: async () => null,
    set: async () => {},
    setex: async () => {},
    del: async () => {},
    scanStream: () => {
        const stream = {
            on: (event: string, callback: any) => {
                if (event === "end") {
                    setTimeout(callback, 0);
                }
                return stream;
            }
        };
        return stream;
    },
    on: (event: string, callback: any) => {
        if (event === "connect") {
            setTimeout(() => callback(), 0);
        }
    }
} as any;

export { redis };