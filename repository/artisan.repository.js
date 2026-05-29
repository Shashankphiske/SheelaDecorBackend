import { prisma } from "../db/prisma.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";
class ArtisanRepository extends BaseRepository {
    constructor() {
        super(prisma.artisans, "ARTISAN");
    }
    fetch = async (id, userId) => {
        const where = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where,
            include: {
                artisanType: true
            }
        });
        return record ?? {};
    };
    fetchAll = async (data, filters, searchFields = []) => {
        let where = {};
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") }]
                    : []),
                { id: (data.sort ?? "desc") }
            ],
            include: {
                artisanType: true
            }
        });
    };
}
export { ArtisanRepository };
//# sourceMappingURL=artisan.repository.js.map