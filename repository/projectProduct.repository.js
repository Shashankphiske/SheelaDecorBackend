import { prisma } from "../db/prisma.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";
class ProjectProductRepository extends BaseRepository {
    constructor() {
        super(prisma.projectProducts, "PROJECT-PRODUCT", { hasCreatedAt: false });
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
                area: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                brand: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                catalogue: {
                    name: true,
                    id: true
                },
                product: true,
            },
        });
        return record ?? {};
    };
    fetchAll = async (data, filters, searchFields = []) => {
        let where = {};
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        where = serverUtils.buildWhere(where, filters, data, searchFields, false);
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
                area: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                brand: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                catalogue: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                product: true,
            },
        });
    };
}
export { ProjectProductRepository };
//# sourceMappingURL=projectProduct.repository.js.map