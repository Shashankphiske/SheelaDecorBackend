import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { DealerService } from "../service/dealer.service.js";
declare class DealerController extends BaseController<DealerService> {
    constructor(service: DealerService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { DealerController };
//# sourceMappingURL=dealer.controller.d.ts.map