import type { Request, Response } from "express";
import type { ProjectService } from "../service/project.service.js";
import { ApiResponse } from "../utils/api.utils.js";
import { BaseController } from "./base.controller.js";
import { logger } from "../utils/logger.util.js";
import { ControllerMessages } from "../constants/controller.messages.js";

const controllerMessages = new ControllerMessages("PROJECT");

class ProjectController extends BaseController<ProjectService> {
    constructor(service: ProjectService) {
        super(service, "PROJECT");
    }

    create = async (req: Request, res: Response) => {
        const project = await this.service.create({...req.body, creatorId: req.user?.id ?? "NA"});

        return ApiResponse.success(res, "Project created", project);
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
                creatorId: req.query.creatorId?.toString(),
                id: req.query.id?.toString()
            },
            [
                "name"
            ]
        );

        return ApiResponse.success(res, controllerMessages.FETCHALL.res, products);
    }
}

export { ProjectController }