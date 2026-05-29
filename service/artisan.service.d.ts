import type { Artisan, ArtisanData } from "../dto/artisan.dto.js";
import type { ArtisanRepository } from "../repository/artisan.repository.js";
import { BaseService } from "./base.service.js";
declare class ArtisanService extends BaseService<Artisan, ArtisanData, any> {
    constructor(methods: ArtisanRepository);
}
export { ArtisanService };
//# sourceMappingURL=artisan.service.d.ts.map