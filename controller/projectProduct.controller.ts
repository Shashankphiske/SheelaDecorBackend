import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { ProjectProductService } from "../service/projectProduct.service.js";

const controllerMessages = new ControllerMessages("PROJECT-PRODUCT");

class ProjectProductController extends BaseController<ProjectProductService> {
    constructor(service: ProjectProductService) {
        super(service, "PROJECT-PRODUCT");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const projectProducts = await this.service.fetchAll(
            this.getPagination(req),
            {
                projectId: req.query.projectId?.toString(),
                productId: req.query.productId?.toString(),
                areaId: req.query.areaId?.toString(),
                companyId: req.query.companyId?.toString(),
                catalogueId: req.query.catalogueId?.toString()
            },
            [
                
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, projectProducts)
    }
}

export { ProjectProductController }