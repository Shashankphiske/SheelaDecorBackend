import type { Request, Response } from "express";
import type { UserService } from "../service/user.service.js";
import { BaseController } from "./base.controller.js";
declare class UserController extends BaseController<UserService> {
    constructor(service: UserService);
    fetch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    forgetPass: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    changePass: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { UserController };
//# sourceMappingURL=user.controller.d.ts.map