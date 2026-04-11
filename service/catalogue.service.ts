import type { Catalogue, CatalogueData } from "../dto/catalogues.dto.js";
import type { CatalogueRepository } from "../repository/catalogue.repository.js";
import { BaseService } from "./base.service.js";

class CatalogueService extends BaseService<Catalogue, CatalogueData, any> {
    constructor(methods: CatalogueRepository) {
        super(methods, "CATALOGUE");
    }
}

export { CatalogueService }