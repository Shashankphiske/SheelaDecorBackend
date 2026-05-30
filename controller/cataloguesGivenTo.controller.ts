import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { CataloguesGivenToService } from "../service/cataloguesGivenTo.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";

const controllerMessages = new ControllerMessages("CATALOGUESGIVENTO");

class CataloguesGivenToController extends BaseController<CataloguesGivenToService> {
    constructor(service: CataloguesGivenToService) {
        super(service, "CATALOGUESGIVENTO");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        // Set up filters
        const filters: any = {};
        if (req.query.catalogueId) {
            filters.catalogueId = req.query.catalogueId.toString();
        }
        if (req.query.clientName) {
            filters.clientName = req.query.clientName.toString();
        }
        if (req.query.siteName) {
            filters.siteName = req.query.siteName.toString();
        }
        if (req.query.receivedStatus) {
            filters.receivedStatus = req.query.receivedStatus === "true";
        }

        const records = await this.service.fetchAll(
            this.getPagination(req),
            filters,
            [
                "clientName",
                "siteName"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, records);
    }
}

export { CataloguesGivenToController }
