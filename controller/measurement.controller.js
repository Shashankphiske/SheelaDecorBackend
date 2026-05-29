import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("MEASUREMENTS");
class MeasurementController extends BaseController {
    constructor(service) {
        super(service, "MEASUREMENTS");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const measurements = await this.service.fetchAll(this.getPagination(req), {}, [
            "projectName"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, measurements);
    };
    update = async (req, res) => {
        const id = req.params.id?.toString();
        if (!id) {
            return ApiResponse.error(res, "Missing project name", 400);
        }
        logger.http(controllerMessages.UPDATE.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA",
            id
        });
        await this.service.update(req.body, id, req.user?.role == "ADMIN" ? undefined : req.user?.id);
        return ApiResponse.success(res, controllerMessages.UPDATE.res, null);
    };
}
export { MeasurementController };
//# sourceMappingURL=measurement.controller.js.map