import type { Measurement } from "../dto/measurement.dto.js";
import { BaseService } from "./base.service.js";
import { MeasurementRepository } from "../repository/measurement.repository.js";
declare class MeasurementService extends BaseService<Measurement, any, any> {
    constructor(methods: MeasurementRepository);
}
export { MeasurementService };
//# sourceMappingURL=measurement.service.d.ts.map