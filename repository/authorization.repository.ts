import { prisma } from "../db/prisma.js";
import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import { logger } from "../utils/logger.util.js";
import { BaseRepository } from "./base.repository.js";

class AuthorizationRepository extends BaseRepository<Authorization, AuthorizationData, any> {
    constructor() {
        super(prisma.authorizations, "AUTHORIZATION");
    }

    create = async (data: any) => {

        const record = data.access.map((accessItem: any) => ({
            userId: data.userId,
            access: accessItem
        }));

        try {
            return await this.model.createMany({ data: record, skipDuplicates: true });
        } catch (error: any) {
            logger.warn(error.message);
        }
    };

}

export {  AuthorizationRepository}