import { prisma } from "../db/prisma.js";
import type { MaterialCategory, MaterialCategoryData } from "../dto/materialCategory.dto.js";
import { BaseRepository } from "./base.repository.js";

class MaterialCategoryRepository extends BaseRepository<MaterialCategory, MaterialCategoryData, any> {
    constructor() {
        super(prisma.materialCategory, "MATERIAL_CATEGORY");
    }
}

export { MaterialCategoryRepository };
