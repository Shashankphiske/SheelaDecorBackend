import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class CustomerRepository extends BaseRepository {
    constructor() {
        super(prisma.customers, "CUSTOMER");
    }
}
export { CustomerRepository };
//# sourceMappingURL=customer.repository.js.map