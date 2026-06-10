import type { MaterialCategory, MaterialCategoryData } from "../dto/materialCategory.dto.js";
import type { MaterialCategoryRepository } from "../repository/materialCategory.repository.js";
import { BaseService } from "./base.service.js";

class MaterialCategoryService extends BaseService<MaterialCategory, MaterialCategoryData, any> {
    constructor(methods: MaterialCategoryRepository) {
        super(methods, "MATERIAL_CATEGORY");
    }
}

export { MaterialCategoryService };
