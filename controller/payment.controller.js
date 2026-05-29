import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("Payment");
class PaymentController extends BaseController {
    constructor(service) {
        super(service, "PAYMENT");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const products = await this.service.fetchAll(this.getPagination(req), {
            customerId: req.query.customerId?.toString(),
            projectId: req.query.projectId?.toString()
        }, []);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, products);
    };
}
export { PaymentController };
//# sourceMappingURL=payment.controller.js.map