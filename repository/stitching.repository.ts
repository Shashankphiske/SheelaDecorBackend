import { prisma } from "../db/prisma.js";
import type { Stitching, StitchingData } from "../dto/stitching.dto.js";
import { BaseRepository } from "./base.repository.js";

class StitchingRepository extends BaseRepository<Stitching, StitchingData, any> {
    constructor() {
        super(prisma.stitchings, "STITCHING");
    }
}

export { StitchingRepository };