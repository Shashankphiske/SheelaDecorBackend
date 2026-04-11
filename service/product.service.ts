import type { Product, ProductData } from "../dto/product.dto.js";
import type { ProductRepository } from "../repository/product.repository.js";
import { BaseService } from "./base.service.js";

class ProductService extends BaseService<Product, ProductData, any> {
    constructor(methods: ProductRepository) {
        super(methods, "PRODUCT");
    }
}

export { ProductService }