import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { MaterialCategoryService } from "../service/materialCategory.service.js";

class MaterialCategoryController extends BaseController<MaterialCategoryService> {
    constructor(service: MaterialCategoryService) {
        super(service, "MATERIAL_CATEGORY");
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

export { MaterialCategoryController };
