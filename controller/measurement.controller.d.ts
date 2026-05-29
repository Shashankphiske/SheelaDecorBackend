import type { Request, Response } from "express";
import type { MeasurementService } from "../service/measurement.service.js";
import { BaseController } from "./base.controller.js";
declare class MeasurementController extends BaseController<MeasurementService> {
    constructor(service: MeasurementService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { MeasurementController };
//# sourceMappingURL=measurement.controller.d.ts.map