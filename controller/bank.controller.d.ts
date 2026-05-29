import type { Request, Response } from "express";
import type { BankService } from "../service/bank.service.js";
import { BaseController } from "./base.controller.js";
declare class BankController extends BaseController<BankService> {
    constructor(service: BankService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { BankController };
//# sourceMappingURL=bank.controller.d.ts.map