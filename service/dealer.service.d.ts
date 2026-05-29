import type { Dealer, DealerData } from "../dto/dealer.dto.js";
import type { DealerRepository } from "../repository/dealer.repository.js";
import { BaseService } from "./base.service.js";
declare class DealerService extends BaseService<Dealer, DealerData, any> {
    constructor(methods: DealerRepository);
}
export { DealerService };
//# sourceMappingURL=dealer.service.d.ts.map