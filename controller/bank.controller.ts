import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { BankService } from "../service/bank.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";

const controllerMessages = new ControllerMessages("BANK");

class BankController extends BaseController<BankService> {
    constructor(service: BankService) {
        super(service, "BANK");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const banks = await this.service.fetchAll(
            this.getPagination(req),
            {

            },
            [
                "accountName",
                "bankName"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, banks)
    }
}

export { BankController };