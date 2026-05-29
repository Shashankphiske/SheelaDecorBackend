import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { ArtisanTypeService } from "../service/artisanType.service.js";
declare class ArtisanTypeController extends BaseController<ArtisanTypeService> {
    constructor(service: ArtisanTypeService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ArtisanTypeController };
//# sourceMappingURL=artisanType.controller.d.ts.map