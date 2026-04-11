import { prisma } from "../db/prisma.js";
import type { Banks, BanksData } from "../dto/banks.dto.js";
import { BaseRepository } from "./base.repository.js";

class BankRepository extends BaseRepository<Banks, BanksData, any> {
    constructor() {
        super(prisma.banks, "BANK");
    }
}

export { BankRepository };