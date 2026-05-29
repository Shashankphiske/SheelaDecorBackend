import type { Request, Response } from "express";
import { BaseController } from "./base.controller.js";
import type { OrderService } from "../service/order.service.js";
declare class OrderController extends BaseController<OrderService> {
    constructor(service: OrderService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { OrderController };
//# sourceMappingURL=order.controller.d.ts.map