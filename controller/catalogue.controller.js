import { ControllerMessages } from "../constants/controller.messages.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
import { ApiResponse } from "../utils/api.utils.js";
const controllerMessages = new ControllerMessages("CATALOGUE");
class CatalogueController extends BaseController {
    constructor(service) {
        super(service, "CATALOGUE");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const catalogues = await this.service.fetchAll(this.getPagination(req), {
            brandId: req.query.brandId?.toString(),
            type: req.query.type?.toString(),
            launchYear: req.query.launchYear?.toString()
        }, [
            "name"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, catalogues);
    };
}
export { CatalogueController };
//# sourceMappingURL=catalogue.controller.js.map