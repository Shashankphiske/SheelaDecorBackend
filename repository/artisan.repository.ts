import { prisma } from "../db/prisma.js";
import type { Artisan, ArtisanData } from "../dto/artisan.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class ArtisanRepository extends BaseRepository<Artisan, ArtisanData, any> {
    constructor() {
        super(prisma.artisans, "ARTISAN");
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
                artisanType: true
            }
        });
        return record ?? ({} as Artisan);
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
                artisanType: true
            }
        });
    };

}

export { ArtisanRepository }