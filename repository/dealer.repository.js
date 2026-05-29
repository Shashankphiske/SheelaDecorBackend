import { prisma } from "../db/prisma.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";
class DealerRepository extends BaseRepository {
    constructor() {
        super(prisma.dealers, "DEALER");
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
                DealsIn: true
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
            include: {
                DealsIn: true
            },
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") }]
                    : []),
                { id: (data.sort ?? "desc") }
            ]
        });
    };
}
export { DealerRepository };
//# sourceMappingURL=dealer.repository.js.map