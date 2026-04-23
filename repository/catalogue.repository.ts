import { prisma } from "../db/prisma.js";
import type { Catalogue, CatalogueData } from "../dto/catalogues.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class CatalogueRepository extends BaseRepository<Catalogue, CatalogueData, any> {
    constructor() {
        super(prisma.catalogues, "CATALOGUE");
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
                brand: true
            }
        });
        return record ?? ({} as Catalogue);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {

        let where: any = {
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            take: data.limit,
            where,
            orderBy: [
                { createdAt: (data.sort ?? "desc") as 'asc' | 'desc' },
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                brand: true
            }
        });
    };
}

export { CatalogueRepository }