import type { CataloguesGivenTo, CataloguesGivenToData } from "../dto/cataloguesGivenTo.dto.js";
import type { CataloguesGivenToRepository } from "../repository/cataloguesGivenTo.repository.js";
import { BaseService } from "./base.service.js";

class CataloguesGivenToService extends BaseService<CataloguesGivenTo, CataloguesGivenToData, any> {
    constructor(methods: CataloguesGivenToRepository) {
        super(methods, "CATALOGUESGIVENTO");
    }
}

export { CataloguesGivenToService }
