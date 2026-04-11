import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { CatalogueService } from "../service/catalogue.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CATALOGUE");

class CatalogueController extends BaseController<CatalogueService> {
    constructor(service: CatalogueService) {
        super(service, "CATALOGUE");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const catalogues = await this.service.fetchAll(
            this.getPagination(req),
            {

            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, catalogues);
    }
}

export { CatalogueController }