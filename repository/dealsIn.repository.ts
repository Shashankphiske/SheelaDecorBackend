import { prisma } from "../db/prisma.js";
import type { DealsIn, DealsInData } from "../dto/dealsIn.dto.js";
import { BaseRepository } from "./base.repository.js";

class DealsInRepository extends BaseRepository<DealsIn, DealsInData, any> {
    constructor() {
        super(prisma.dealsIn, "DEALSIN", { hasCreatedAt: false });
    }
}

export { DealsInRepository };