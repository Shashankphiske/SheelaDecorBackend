import type { Request, Response } from "express";
import type { TaskService } from "../service/task.service.js";
import { BaseController } from "./base.controller.js";
declare class TaskController extends BaseController<TaskService> {
    constructor(service: TaskService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { TaskController };
//# sourceMappingURL=task.controller.d.ts.map