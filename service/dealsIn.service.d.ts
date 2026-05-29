import type { DealsIn, DealsInData } from "../dto/dealsIn.dto.js";
import type { DealsInRepository } from "../repository/dealsIn.repository.js";
import { BaseService } from "./base.service.js";
declare class DealsInService extends BaseService<DealsIn, DealsInData, any> {
    constructor(methods: DealsInRepository);
}
export { DealsInService };
//# sourceMappingURL=dealsIn.service.d.ts.map