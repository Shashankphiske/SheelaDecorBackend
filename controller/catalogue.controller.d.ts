import type { Request, Response } from "express";
import type { CatalogueService } from "../service/catalogue.service.js";
import { BaseController } from "./base.controller.js";
declare class CatalogueController extends BaseController<CatalogueService> {
    constructor(service: CatalogueService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { CatalogueController };
//# sourceMappingURL=catalogue.controller.d.ts.map