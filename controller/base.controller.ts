import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../utils/api.utils.js";

abstract class BaseController <TService> {
    protected messages: ControllerMessages;

    constructor(
        protected service: TService,
        protected modelName: string
    ) {
        this.messages = new ControllerMessages(modelName);
    }

    protected logRequest(req: Request, message: string, extra = {}) {
        logger.http(message, {
            ip: req.ip,
            userId: req.user?.id ?? "PUBLIC",
            ...extra
        });
    }

    protected getPagination(req: Request) {
        return {
            limit: Number(req.query.limit) || 10,
            sort: req.query.sort?.toString(),
            search: req.query.search?.toString(),
            lastId: req.query.lastId?.toString(),
            lastCreatedAt: req.query.lastCreatedAt ? new Date(req.query.lastCreatedAt.toString()) : undefined
        }
    }

    create = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.CREATE.req);
        // @ts-ignore
        const result = await this.service.create(req.body);
        return ApiResponse.success(res, this.messages.CREATE.res, result);
    }

    fetch = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.FETCH.req);
        //@ts-ignore
        const result = await this.service.fetch(req.params.id?.toString(), req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.FETCH.res, result);
    }

    update = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.UPDATE.req);
        // @ts-ignore
        const result = await this.service.update(req.body, req.params.id?.toString(), req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, this.messages.UPDATE.res, result);
    }

    delete = async (req: Request, res: Response) => {
        this.logRequest(req, this.messages.DELETE.req);
        // @ts-ignore
        const result = await this.service.delete(req.params.id?.toString());
        return ApiResponse.success(res, this.messages.DELETE.res, result);
    }
}

export { BaseController };