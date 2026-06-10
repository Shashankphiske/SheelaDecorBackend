import { prisma } from "../db/prisma.js";
import type { MachineBrand, MachineBrandData } from "../dto/machineBrand.dto.js";
import { BaseRepository } from "./base.repository.js";

class MachineBrandRepository extends BaseRepository<MachineBrand, MachineBrandData, any> {
    constructor() {
        super(prisma.machineBrand, "MACHINE_BRAND");
    }
}

export { MachineBrandRepository };
