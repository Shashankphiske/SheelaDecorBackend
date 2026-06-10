import { prisma } from "../db/prisma.js";
import type { MachineCategory, MachineCategoryData } from "../dto/machineCategory.dto.js";
import { BaseRepository } from "./base.repository.js";

class MachineCategoryRepository extends BaseRepository<MachineCategory, MachineCategoryData, any> {
    constructor() {
        super(prisma.machineCategory, "MACHINE_CATEGORY");
    }
}

export { MachineCategoryRepository };
