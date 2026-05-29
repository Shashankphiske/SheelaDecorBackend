import type { Request, Response } from "express";
import type { InquiryService } from "../service/inquiry.service.js";
import { BaseController } from "./base.controller.js";
declare class InquiryController extends BaseController<InquiryService> {
    constructor(service: InquiryService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { InquiryController };
//# sourceMappingURL=inquiry.controller.d.ts.map