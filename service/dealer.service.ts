import type { Dealer, DealerData } from "../dto/dealer.dto.js";
import type { DealerRepository } from "../repository/dealer.repository.js";
import { BaseService } from "./base.service.js";

class DealerService extends BaseService<Dealer, DealerData, any> {
    constructor(methods: DealerRepository) {
        super(methods, "DEALER");
    }
}

export { DealerService };