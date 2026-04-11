import { prisma } from "../db/prisma.js";
import type { Area, AreaData } from "../dto/area.dto.js";
import { BaseRepository } from "./base.repository.js";

class AreaRepository extends BaseRepository<Area, AreaData, any> {
    constructor() {
        super(prisma.areas, "AREA");
    }
}

export { AreaRepository };