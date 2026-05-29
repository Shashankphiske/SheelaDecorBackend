import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("ORDER");
class OrderController extends BaseController {
    constructor(service) {
        super(service, "ORDER");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const areas = await this.service.fetchAll(this.getPagination(req), {
            brandId: req.query.brandId?.toString(),
            catalogueId: req.query.catalogueId?.toString(),
            projectId: req.query.projectId?.toString(),
            customerId: req.query.customerId?.toString(),
            areaId: req.query.areaId?.toString()
        }, [
            "orderId"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, areas);
    };
}
export { OrderController };
//# sourceMappingURL=order.controller.js.map