import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("ARTISAN");
class ArtisanController extends BaseController {
    constructor(service) {
        super(service, "ARTISAN");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const artisans = await this.service.fetchAll(this.getPagination(req), {
            artisanType: req.query.artisanType?.toString()
        }, [
            "name",
            "address",
            "email"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, artisans);
    };
}
export { ArtisanController };
//# sourceMappingURL=artisan.controller.js.map