import type { Artisan, ArtisanData } from "../dto/artisan.dto.js";
import type { ArtisanRepository } from "../repository/artisan.repository.js";
import { BaseService } from "./base.service.js";

class ArtisanService extends BaseService<Artisan, ArtisanData, any> {
    constructor(methods: ArtisanRepository) {
        super(methods, "ARTISAN");
    }
}

export { ArtisanService }