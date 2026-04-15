import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { PaymentService } from "../service/payment.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("Payment");

class PaymentController extends BaseController<PaymentService> {
    constructor(service: PaymentService) {
        super(service, "PAYMENT");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const products = await this.service.fetchAll(
            this.getPagination(req),
            {
                customerId: req.query.customerId?.toString(),
                projectId: req.query.projectId?.toString()
            },
            [
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, products);
    }    
}

export { PaymentController }