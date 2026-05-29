import type { Request, Response } from "express";
import type { AreaService } from "../service/area.service.js";
import { BaseController } from "./base.controller.js";
declare class AreaController extends BaseController<AreaService> {
    constructor(service: AreaService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { AreaController };
//# sourceMappingURL=area.controller.d.ts.map