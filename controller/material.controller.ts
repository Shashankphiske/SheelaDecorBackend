import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { MaterialService } from "../service/material.service.js";

class MaterialController extends BaseController<MaterialService> {
    constructor(service: MaterialService) {
        super(service, "MATERIAL");
    }

    fetchAll = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.FETCHALL.req);

        const records = await this.service.fetchAll(
            this.getPagination(req),
            {
                categoryId: req.query.categoryId?.toString()
            },
            ["name", "unit"]
        );

        return ApiResponse.success(res, this.messages.FETCHALL.res, records);
    }
}

export { MaterialController };
