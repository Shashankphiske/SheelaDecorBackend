
import type { DealsIn, DealsInData } from "../dto/dealsIn.dto.js";
import type { DealsInRepository } from "../repository/dealsIn.repository.js";
import { BaseService } from "./base.service.js";

class DealsInService extends BaseService<DealsIn, DealsInData, any> {
    constructor(methods: DealsInRepository) {
        super(methods, "DEALSIN");
    }
}

export { DealsInService };