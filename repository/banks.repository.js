import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class BankRepository extends BaseRepository {
    constructor() {
        super(prisma.banks, "BANK");
    }
}
export { BankRepository };
//# sourceMappingURL=banks.repository.js.map