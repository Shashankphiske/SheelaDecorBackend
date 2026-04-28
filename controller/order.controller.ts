import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { AreaService } from "../service/area.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { OrderService } from "../service/order.service.js";

const controllerMessages = new ControllerMessages("ORDER");

class OrderController extends BaseController<OrderService> {
    constructor(service: OrderService) {
        super(service, "ORDER");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const areas = await this.service.fetchAll(
            this.getPagination(req),
            {
                brandId: req.query.brandId?.toString(),
                catalogueId: req.query.catalogueId?.toString(),
                projectId: req.query.projectId?.toString(),
                customerId: req.query.customerId?.toString(),
                areaId: req.query.areaId?.toString()
            },
            [
                "orderId"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, areas)
    }
}

export { OrderController }