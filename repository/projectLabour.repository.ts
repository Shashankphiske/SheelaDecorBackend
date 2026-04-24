import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { ProjectLabour, ProjectLabourData } from "../dto/projectLabour.dto.js";
import { serverUtils } from "../utils/server.utils.js";

import { BaseRepository } from "./base.repository.js";

class ProjectLabourRepository extends BaseRepository<ProjectLabour, ProjectLabourData, any> {
    constructor() {
        super(prisma.projectLabours, "PROJECT-LABOUR", { hasCreatedAt: false });
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
                artisan: true
            },
        });
        return record ?? ({} as ProjectLabour);
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
                artisan: true
            },
        });
    };
}

export { ProjectLabourRepository };