import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { MachineBrandService } from "../service/machineBrand.service.js";

class MachineBrandController extends BaseController<MachineBrandService> {
    constructor(service: MachineBrandService) {
        super(service, "MACHINE_BRAND");
    }

    fetchAll = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.FETCHALL.req);

        const records = await this.service.fetchAll(
            this.getPagination(req),
            {},
            ["name"]
        );

        return ApiResponse.success(res, this.messages.FETCHALL.res, records);
    }
}

export { MachineBrandController };
