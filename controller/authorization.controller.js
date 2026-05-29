import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("AUTHORIZATION");
class AuthorizationController extends BaseController {
    constructor(service) {
        super(service, "AUTHORIZATION");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const authorizations = await this.service.fetchAll(this.getPagination(req), {
            userId: req.params.userId?.toString(),
            access: req.params.access?.toString()
        }, []);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, authorizations);
    };
}
export { AuthorizationController };
//# sourceMappingURL=authorization.controller.js.map