import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import type { AreaService } from "../service/area.service.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
import type { ProjectLabourService } from "../service/projectLabour.service.js";

const controllerMessages = new ControllerMessages("PROJECT-LABOUR");

class ProjectLabourController extends BaseController<ProjectLabourService> {
    constructor(service: ProjectLabourService) {
        super(service, "AREA");
    }

    fetchAll = async (req: Request, res: Response) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });

        const projectLabours = await this.service.fetchAll(
            this.getPagination(req),
            {
                artisanId: req.query.artisanId?.toString(),
                projectId: req.query.projectId?.toString()
            },
            [
                "unit"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, projectLabours)
    }
}

export { ProjectLabourController }