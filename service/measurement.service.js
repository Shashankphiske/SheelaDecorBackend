import { BaseService } from "./base.service.js";
import { MeasurementRepository } from "../repository/measurement.repository.js";
class MeasurementService extends BaseService {
    constructor(methods) {
        super(methods, "MEASUREMENTS");
    }
}
export { MeasurementService };
//# sourceMappingURL=measurement.service.js.map