import type { Request, Response } from "express";
import type { AuthService } from "../service/auth.service.js";
declare class AuthController {
    private service;
    constructor(service: AuthService);
    login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    fetchState: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { AuthController };
//# sourceMappingURL=auth.controller.d.ts.map