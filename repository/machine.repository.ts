import { prisma } from "../db/prisma.js";
import type { Machine, MachineData } from "../dto/machine.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class MachineRepository extends BaseRepository<Machine, MachineData, any> {
    constructor() {
        super(prisma.machine, "MACHINE");
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
                category: true,
                brand: true
            }
        });

        return record ?? ({} as Machine);
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        return await this.model.findMany({
            take: data.limit,
            where,
            include: {
                category: true,
                brand: true
            },
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: (data.sort ?? "desc") as 'asc' | 'desc' }]
                    : []
                ),
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ]
        });
    };
}

export { MachineRepository };
