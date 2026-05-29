import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class ArtisanTypeRepository extends BaseRepository {
    constructor() {
        super(prisma.artisanTypes, "ARTISAN-TYPE", { hasCreatedAt: false });
    }
}
export { ArtisanTypeRepository };
//# sourceMappingURL=artisanType.repository.js.map