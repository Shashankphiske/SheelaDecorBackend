import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("DEALSIN");
class DealsInController extends BaseController {
    constructor(service) {
        super(service, "DEALSIN");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const dealsIn = await this.service.fetchAll(this.getPagination(req), {
            dealsInId: req.query.dealsInId?.toString()
        }, [
            "name",
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, dealsIn);
    };
}
export { DealsInController };
//# sourceMappingURL=dealsIn.controller.js.map