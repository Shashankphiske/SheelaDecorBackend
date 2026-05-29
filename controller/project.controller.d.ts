import type { Request, Response } from "express";
import type { ProjectService } from "../service/project.service.js";
import { BaseController } from "./base.controller.js";
declare class ProjectController extends BaseController<ProjectService> {
    constructor(service: ProjectService);
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ProjectController };
//# sourceMappingURL=project.controller.d.ts.map