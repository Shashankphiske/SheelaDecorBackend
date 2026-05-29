import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("AREA");
class AreaController extends BaseController {
    constructor(service) {
        super(service, "AREA");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const areas = await this.service.fetchAll(this.getPagination(req), {}, [
            "name"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, areas);
    };
}
export { AreaController };
//# sourceMappingURL=area.controller.js.map