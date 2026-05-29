import type { Request, Response } from "express";
import type { BrandService } from "../service/brand.service.js";
import { BaseController } from "./base.controller.js";
declare class BrandController extends BaseController<BrandService> {
    constructor(service: BrandService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { BrandController };
//# sourceMappingURL=brand.controller.d.ts.map