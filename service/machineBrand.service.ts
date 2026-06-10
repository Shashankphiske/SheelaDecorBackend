import type { MachineBrand, MachineBrandData } from "../dto/machineBrand.dto.js";
import type { MachineBrandRepository } from "../repository/machineBrand.repository.js";
import { BaseService } from "./base.service.js";

class MachineBrandService extends BaseService<MachineBrand, MachineBrandData, any> {
    constructor(methods: MachineBrandRepository) {
        super(methods, "MACHINE_BRAND");
    }
}

export { MachineBrandService };
