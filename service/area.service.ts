import type { Area, AreaData } from "../dto/area.dto.js";
import type { AreaRepository } from "../repository/area.repository.js";
import { BaseService } from "./base.service.js";

class AreaService extends BaseService<Area, AreaData, any> {
    constructor(methods: AreaRepository) {
        super(methods, "AREA");
    }
}

export { AreaService };