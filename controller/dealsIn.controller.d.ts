import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { DealsInService } from "../service/dealsIn.service.js";
declare class DealsInController extends BaseController<DealsInService> {
    constructor(service: DealsInService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { DealsInController };
//# sourceMappingURL=dealsIn.controller.d.ts.map