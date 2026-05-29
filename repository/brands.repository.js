import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class BrandsRepository extends BaseRepository {
    constructor() {
        super(prisma.brands, "BRAND");
    }
}
export { BrandsRepository };
//# sourceMappingURL=brands.repository.js.map