import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("PRODUCT");
class ProductController extends BaseController {
    constructor(service) {
        super(service, "PRODUCT");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const products = await this.service.fetchAll(this.getPagination(req), {
            sellingUnit: req.query.sellingUnit?.toString(),
            productType: req.query.productType?.toString()
        }, [
            "name"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, products);
    };
}
export { ProductController };
//# sourceMappingURL=product.controller.js.map