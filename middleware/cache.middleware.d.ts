import type { NextFunction, Request, Response } from "express";
declare class CacheMiddleware {
    private client;
    constructor(client: any);
    cacheRequest: (ttl: number, type?: "PUBLIC" | "PRIVATE") => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
declare const cacheMiddleware: CacheMiddleware;
export { cacheMiddleware };
//# sourceMappingURL=cache.middleware.d.ts.map