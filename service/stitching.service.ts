import type { Stitching, StitchingData } from "../dto/stitching.dto.js";
import type { StitchingRepository } from "../repository/stitching.repository.js";
import { BaseService } from "./base.service.js";

class StitchingService extends BaseService<Stitching, StitchingData, any> {
    constructor(methods: StitchingRepository) {
        super(methods, "STITCHING");
    }
}

export { StitchingService }