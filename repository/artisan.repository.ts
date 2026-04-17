import { prisma } from "../db/prisma.js";
import type { Artisan, ArtisanData } from "../dto/artisan.dto.js";
import { BaseRepository } from "./base.repository.js";

class ArtisanRepository extends BaseRepository<Artisan, ArtisanData, any> {
    constructor() {
        super(prisma.artisans, "ARTISAN");
    }
}

export { ArtisanRepository }