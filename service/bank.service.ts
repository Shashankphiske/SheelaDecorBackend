import type { Banks, BanksData } from "../dto/banks.dto.js";
import type { BankRepository } from "../repository/banks.repository.js";
import { BaseService } from "./base.service.js";

class BankService extends BaseService<Banks, BanksData, any> {
    constructor(methods: BankRepository) {
        super(methods, "BANK");
    }
}

export { BankService }