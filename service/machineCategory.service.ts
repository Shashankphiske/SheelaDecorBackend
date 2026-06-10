import type { MachineCategory, MachineCategoryData } from "../dto/machineCategory.dto.js";
import type { MachineCategoryRepository } from "../repository/machineCategory.repository.js";
import { BaseService } from "./base.service.js";

class MachineCategoryService extends BaseService<MachineCategory, MachineCategoryData, any> {
    constructor(methods: MachineCategoryRepository) {
        super(methods, "MACHINE_CATEGORY");
    }
}

export { MachineCategoryService };
