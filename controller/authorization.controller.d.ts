import type { Request, Response } from "express";
import type { AuthorizationService } from "../service/authorization.service.js";
import { BaseController } from "./base.controller.js";
declare class AuthorizationController extends BaseController<AuthorizationService> {
    constructor(service: AuthorizationService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { AuthorizationController };
//# sourceMappingURL=authorization.controller.d.ts.map