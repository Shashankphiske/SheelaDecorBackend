import { prisma } from "../db/prisma.js";
import type { ArtisanType, ArtisanTypeData } from "../dto/artisanType.dto.js";
import { BaseRepository } from "./base.repository.js";

class ArtisanTypeRepository extends BaseRepository<ArtisanType, ArtisanTypeData, any> {
    constructor() {
        super(prisma.artisanTypes, "ARTISAN-TYPE", { hasCreatedAt: false });
    }
}

export { ArtisanTypeRepository };