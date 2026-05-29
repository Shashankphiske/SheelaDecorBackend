import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class AreaRepository extends BaseRepository {
    constructor() {
        super(prisma.areas, "AREA");
    }
}
export { AreaRepository };
//# sourceMappingURL=area.repository.js.map