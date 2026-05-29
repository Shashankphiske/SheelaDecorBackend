import type { ArtisanType, ArtisanTypeData } from "../dto/artisanType.dto.js";
import type { AreaRepository } from "../repository/area.repository.js";
import { BaseService } from "./base.service.js";
declare class ArtisanTypeService extends BaseService<ArtisanType, ArtisanTypeData, any> {
    constructor(methods: AreaRepository);
}
export { ArtisanTypeService };
//# sourceMappingURL=artisanType.service.d.ts.map