import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
declare const service: AuthService;
declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const authenticateAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
declare const authorizePage: (pageKeys: string | string[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export { authenticate, authenticateAdmin, authorizePage, service as AuthService };
//# sourceMappingURL=authenticate.middleware.d.ts.map