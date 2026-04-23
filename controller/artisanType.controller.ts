import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { ArtisanTypeService } from "../service/artisanType.service.js";

const controllerMessages = new ControllerMessages("ARTISAN-TYPE");

class ArtisanTypeController extends BaseController<ArtisanTypeService> {
    constructor(service: ArtisanTypeService) {
        super(service, "ARTISAN-TYPE");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const artisanTypes = await this.service.fetchAll(
            this.getPagination(req),
            {

            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, artisanTypes)
    }
}

export { ArtisanTypeController }