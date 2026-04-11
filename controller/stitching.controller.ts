import type { StitchingService } from "../service/stitching.service.js";
import { BaseController } from "./base.controller.js";

class StitchingController extends BaseController<StitchingService> {
    constructor(service: StitchingService) {
        super(service, "STITCHING");
    }
}

export { StitchingController }