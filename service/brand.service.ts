import type { Brands, BrandsData } from "../dto/brands.dto.js";
import type { BrandsRepository } from "../repository/brands.repository.js";
import { BaseService } from "./base.service.js";

class BrandService extends BaseService<Brands, BrandsData, any> {
    constructor(methods: BrandsRepository){
        super(methods, "BRAND");
    }
}

export { BrandService }