import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("ARTISAN-TYPE");
class ArtisanTypeController extends BaseController {
    constructor(service) {
        super(service, "ARTISAN-TYPE");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const artisanTypes = await this.service.fetchAll(this.getPagination(req), {}, [
            "name"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, artisanTypes);
    };
}
export { ArtisanTypeController };
//# sourceMappingURL=artisanType.controller.js.map