import type { Request, Response } from "express";
import type { PaymentService } from "../service/payment.service.js";
import { BaseController } from "./base.controller.js";
declare class PaymentController extends BaseController<PaymentService> {
    constructor(service: PaymentService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { PaymentController };
//# sourceMappingURL=payment.controller.d.ts.map