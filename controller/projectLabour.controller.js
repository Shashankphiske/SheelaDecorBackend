import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("PROJECT-LABOUR");
class ProjectLabourController extends BaseController {
    constructor(service) {
        super(service, "PROJECT-LABOUR");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const projectLabours = await this.service.fetchAll(this.getPagination(req), {
            artisanId: req.query.artisanId?.toString(),
            projectId: req.query.projectId?.toString(),
            productId: req.query.productId?.toString(),
            status: req.query.status?.toString(),
            lastId: req.query.lastId?.toString()
        }, []);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, projectLabours);
    };
}
export { ProjectLabourController };
//# sourceMappingURL=projectLabour.controller.js.map