import type { Measurement } from "../dto/measurement.dto.js";
import { BaseService } from "./base.service.js";
import { MeasurementRepository } from "../repository/measurement.repository.js";

class MeasurementService extends BaseService<Measurement, any, any>{
    constructor(methods: MeasurementRepository){
        super(methods, "MEASUREMENTS");
    }
}

export { MeasurementService }