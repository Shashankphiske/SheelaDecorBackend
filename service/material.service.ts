import type { Material, MaterialData } from "../dto/material.dto.js";
import type { MaterialRepository } from "../repository/material.repository.js";
import { BaseService } from "./base.service.js";

class MaterialService extends BaseService<Material, MaterialData, any> {
    constructor(methods: MaterialRepository) {
        super(methods, "MATERIAL");
    }
}

export { MaterialService };
