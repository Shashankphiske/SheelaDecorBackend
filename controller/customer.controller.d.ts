import type { Request, Response } from "express";
import type { CustomerService } from "../service/customer.service.js";
import { BaseController } from "./base.controller.js";
declare class CustomerController extends BaseController<CustomerService> {
    constructor(service: CustomerService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { CustomerController };
//# sourceMappingURL=customer.controller.d.ts.map