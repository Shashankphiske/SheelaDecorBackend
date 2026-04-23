import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { DealsInService } from "../service/dealsIn.service.js";

const controllerMessages = new ControllerMessages("DEALSIN");

class DealsInController extends BaseController<DealsInService> {
    constructor(service: DealsInService) {
        super(service, "DEALSIN");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const dealsIn = await this.service.fetchAll(
            this.getPagination(req),
            {
                dealsInId: req.query.dealsInId?.toString()
            },
            [
                "name",
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, dealsIn)
    }
}

export { DealsInController }