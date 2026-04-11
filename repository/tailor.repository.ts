import { prisma } from "../db/prisma.js";
import type { Tailor, TailorData } from "../dto/tailor.dto.js";
import { BaseRepository } from "./base.repository.js";

class TailorRepository extends BaseRepository<Tailor, TailorData, any> {
    constructor() {
        super(prisma.tailors, "TAILOR");
    }
}

export { TailorRepository }