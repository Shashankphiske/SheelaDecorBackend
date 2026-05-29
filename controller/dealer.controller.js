import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("DEALER");
class DealerController extends BaseController {
    constructor(service) {
        super(service, "DEALER");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const dealers = await this.service.fetchAll(this.getPagination(req), {
            dealsInId: req.query.dealsInId?.toString()
        }, [
            "name",
            "personName",
            "description",
            "address"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, dealers);
    };
}
export { DealerController };
//# sourceMappingURL=dealer.controller.js.map