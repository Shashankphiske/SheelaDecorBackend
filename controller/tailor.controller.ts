import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { TailorService } from "../service/tailor.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("TAILOR");

class TailorController extends BaseController<TailorService> {
    constructor(service: TailorService) {
        super(service, "TAILOR");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const tailors = await this.service.fetchAll(
            this.getPagination(req),
            {

            },
            [
                "name",
                "address",
                "email"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, tailors)
    }
}

export { TailorController }