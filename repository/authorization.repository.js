import { prisma } from "../db/prisma.js";
import { logger } from "../utils/logger.util.js";
import { serverUtils } from "../utils/server.utils.js";
import { BaseRepository } from "./base.repository.js";
class AuthorizationRepository extends BaseRepository {
    constructor() {
        super(prisma.authorizations, "AUTHORIZATION");
    }
    create = async (data) => {
        await this.model.deleteMany({
            where: {
                userId: data.userId,
            },
        });
        // Step 2: recreate from array (same as create)
        const records = (data.access || []).map((accessItem) => ({
            userId: data.userId,
            access: accessItem,
        }));
        if (!records.length)
            return [];
        return await this.model.createMany({
            data: records,
            skipDuplicates: true,
        });
    };
    fetchAll = async (data, filters, searchFields = []) => {
        let where = {};
        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        where = serverUtils.buildWhere(where, filters, data, searchFields);
        return await this.model.findMany({
            where,
            orderBy: [
                { id: (data.sort ?? "desc") }
            ]
        });
    };
    update = async (data, id, userId) => {
        try {
            // Step 1: delete existing access for this user
            await this.model.deleteMany({
                where: {
                    userId: data.userId || userId,
                },
            });
            // Step 2: recreate from array (same as create)
            const records = (data.access || []).map((accessItem) => ({
                userId: data.userId || userId,
                access: accessItem,
            }));
            if (!records.length)
                return [];
            return await this.model.createMany({
                data: records,
                skipDuplicates: true,
            });
        }
        catch (error) {
            logger.warn(error.message);
        }
    };
    fetchAuth = async (userId) => {
        const data = await this.model.findMany({
            where: {
                userId
            },
            select: {
                access: true
            }
        });
        return data.map((item) => item.access);
    };
}
export { AuthorizationRepository };
//# sourceMappingURL=authorization.repository.js.map