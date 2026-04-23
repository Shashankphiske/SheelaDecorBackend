import type { ArtisanType, ArtisanTypeData } from "../dto/artisanType.dto.js";
import type { AreaRepository } from "../repository/area.repository.js";
import { BaseService } from "./base.service.js";

class ArtisanTypeService extends BaseService<ArtisanType, ArtisanTypeData, any> {
    constructor(methods: AreaRepository) {
        super(methods, "ARTISAN-TYPE");
    }
}

export { ArtisanTypeService };