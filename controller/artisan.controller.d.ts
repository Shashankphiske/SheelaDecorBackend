import type { Request, Response } from "express";
import type { ArtisanService } from "../service/artisan.service.js";
import { BaseController } from "./base.controller.js";
declare class ArtisanController extends BaseController<ArtisanService> {
    constructor(service: ArtisanService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ArtisanController };
//# sourceMappingURL=artisan.controller.d.ts.map