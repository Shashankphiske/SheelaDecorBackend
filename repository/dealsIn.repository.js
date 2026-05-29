import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class DealsInRepository extends BaseRepository {
    constructor() {
        super(prisma.dealsIn, "DEALSIN", { hasCreatedAt: false });
    }
}
export { DealsInRepository };
//# sourceMappingURL=dealsIn.repository.js.map