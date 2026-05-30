import { prisma } from "../db/prisma.js";
import type { CataloguesGivenTo, CataloguesGivenToData } from "../dto/cataloguesGivenTo.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class CataloguesGivenToRepository extends BaseRepository<CataloguesGivenTo, CataloguesGivenToData, any> {
    constructor() {
        super(prisma.cataloguesGivenTo, "CATALOGUESGIVENTO");
    }

    create = async (data: CataloguesGivenToData): Promise<CataloguesGivenTo> => {
        return await this.model.create({
            data: {
                ...data,
                givenDate: new Date(data.givenDate)
            }
        });
    };

    update = async (data: Partial<CataloguesGivenToData>, id: string, userId?: string) => {
        try {
            const where: any = {
                [this.config.primaryKey]: id,
                ...(userId ? { userId } : {})
            };

            const updateData = { ...data };
            if (updateData.givenDate) {
                updateData.givenDate = new Date(updateData.givenDate);
            }

            await this.model.update({
                where,
                data: updateData
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

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
                catalogue: true
            }
        });
        return record ?? ({} as CataloguesGivenTo);
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
                { createdAt: (data.sort ?? "desc") as 'asc' | 'desc' },
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ],
            include: {
                catalogue: true
            }
        });
    };
}

export { CataloguesGivenToRepository }
