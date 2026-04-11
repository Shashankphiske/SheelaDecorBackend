import { prisma } from "../db/prisma.js";
import type { Catalogue, CatalogueData } from "../dto/catalogues.dto.js";
import { BaseRepository } from "./base.repository.js";

class CatalogueRepository extends BaseRepository<Catalogue, CatalogueData, any> {
    constructor() {
        super(prisma.catalogues, "CATALOGUE");
    }
}

export { CatalogueRepository }