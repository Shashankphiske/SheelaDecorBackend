import type { Banks, BanksData } from "../dto/banks.dto.js";
import type { BankRepository } from "../repository/banks.repository.js";
import { BaseService } from "./base.service.js";
declare class BankService extends BaseService<Banks, BanksData, any> {
    constructor(methods: BankRepository);
}
export { BankService };
//# sourceMappingURL=bank.service.d.ts.map