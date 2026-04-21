import { prisma } from "../db/prisma.js";
import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { logger } from "../utils/logger.util.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";

class AuthorizationRepository extends BaseRepository<Authorization, AuthorizationData, any> {
    constructor() {
        super(prisma.authorizations, "AUTHORIZATION");
    }

    create = async (data: any) => {

        await this.model.deleteMany({
            where: {
                userId: data.userId,
            },
        });

        // Step 2: recreate from array (same as create)
        const records = (data.access || []).map((accessItem: any) => ({
            userId: data.userId,
            access: accessItem,
        }));

        if (!records.length) return [];

        return await this.model.createMany({
            data: records,
            skipDuplicates: true,
        });
    };

    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {

        let where: any = {
        };
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            where,
            orderBy: [
                { id: (data.sort ?? "desc") as 'asc' | 'desc' }
            ]
        });
    };

    update = async (data: any, id: string, userId?: string) => {
        try {
            // Step 1: delete existing access for this user
            await this.model.deleteMany({
                where: {
                    userId: data.userId || userId,
                },
            });

            // Step 2: recreate from array (same as create)
            const records = (data.access || []).map((accessItem: any) => ({
                userId: data.userId || userId,
                access: accessItem,
            }));

            if (!records.length) return [];

            return await this.model.createMany({
                data: records,
                skipDuplicates: true,
            });

        } catch (error: any) {
            logger.warn(error.message);
        }
    };

    fetchAuth = async (userId: string) => {
        const data = await this.model.findMany({
            where: {
                userId
            },
            select: {
                access: true
            }
        });
        return data.map((item: any) => item.access);
    }

}

export {  AuthorizationRepository}