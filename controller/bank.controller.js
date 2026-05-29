import { ControllerMessages } from "../constants/controller.messages.js";
import { ApiResponse } from "../utils/api.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseController } from "./base.controller.js";
const controllerMessages = new ControllerMessages("BANK");
class BankController extends BaseController {
    constructor(service) {
        super(service, "BANK");
    }
    fetchAll = async (req, res) => {
        logger.http(controllerMessages.FETCHALL.req, {
            ip: req.ip,
            userId: req.user?.id ?? "NA"
        });
        const banks = await this.service.fetchAll(this.getPagination(req), {}, [
            "accountName",
            "bankName"
        ]);
        return ApiResponse.success(res, controllerMessages.FETCHALL.res, banks);
    };
}
export { BankController };
//# sourceMappingURL=bank.controller.js.map