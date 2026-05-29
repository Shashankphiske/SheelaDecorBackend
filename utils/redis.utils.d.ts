import type { Request } from "express";
declare class RedisUtils {
    generateKey: (req: Request, type: string) => string;
    invalidateKey: (userId: string, resource: string, action: string) => Promise<void>;
    generatePayloadHash: (req: Request) => void;
}
export { RedisUtils };
//# sourceMappingURL=redis.utils.d.ts.map