import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { ProjectLabourService } from "../service/projectLabour.service.js";
declare class ProjectLabourController extends BaseController<ProjectLabourService> {
    constructor(service: ProjectLabourService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ProjectLabourController };
//# sourceMappingURL=projectLabour.controller.d.ts.map