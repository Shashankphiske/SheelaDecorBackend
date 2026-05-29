import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { ProjectProductService } from "../service/projectProduct.service.js";
declare class ProjectProductController extends BaseController<ProjectProductService> {
    constructor(service: ProjectProductService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ProjectProductController };
//# sourceMappingURL=projectProduct.controller.d.ts.map