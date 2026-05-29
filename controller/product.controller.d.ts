import type { Request, Response } from "express";
import type { ProductService } from "../service/product.service.js";
import { BaseController } from "./base.controller.js";
declare class ProductController extends BaseController<ProductService> {
    constructor(service: ProductService);
    fetchAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ProductController };
//# sourceMappingURL=product.controller.d.ts.map