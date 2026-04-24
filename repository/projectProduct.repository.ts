import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { ProjectProduct, ProjectProductData } from "../dto/projectProduct.dto.js";
import { serverUtils } from "../utils/server.utils.js";

import { BaseRepository } from "./base.repository.js";

class ProjectProductRepository extends BaseRepository<ProjectProduct, ProjectProductData, any> {
    constructor() {
        super(prisma.projectProducts, "PROJECT-PRODUCT", { hasCreatedAt: false });
    }

    fetch = async (id: string, userId?: string) => {

        const where: any = {
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
        return record ?? ({} as ProjectProduct);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") as 'asc' | 'desc' }]
                    : []
                ),
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
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