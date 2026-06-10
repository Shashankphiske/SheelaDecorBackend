import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { MachineService } from "../service/machine.service.js";

class MachineController extends BaseController<MachineService> {
    constructor(service: MachineService) {
        super(service, "MACHINE");
    }

    fetchAll = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.FETCHALL.req);

        const records = await this.service.fetchAll(
            this.getPagination(req),
            {
                categoryId: req.query.categoryId?.toString(),
                brandId: req.query.brandId?.toString(),
                status: req.query.status?.toString()
            },
            ["name", "location"]
        );

        return ApiResponse.success(res, this.messages.FETCHALL.res, records);
    }
}

export { MachineController };
