import type { Request, Response } from "express";
import { ControllerMessages } from "../constants/controller.messages.js";
declare abstract class BaseController<TService> {
    protected service: TService;
    protected modelName: string;
    protected messages: ControllerMessages;
    constructor(service: TService, modelName: string);
    protected logRequest(req: Request, message: string, extra?: {}): void;
    protected getPagination(req: Request): {
        limit: number;
        sort: string | undefined;
        search: string | undefined;
        lastId: string | undefined;
        lastCreatedAt: Date | undefined;
        minPrice: number | undefined;
        maxPrice: number | undefined;
        startDate: Date | undefined;
        endDate: Date | undefined;
    };
    create: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createMany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    fetch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    update: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    delete: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { BaseController };
//# sourceMappingURL=base.controller.d.ts.map