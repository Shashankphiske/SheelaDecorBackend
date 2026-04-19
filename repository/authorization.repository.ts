import { prisma } from "../db/prisma.js";
import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import { BaseRepository } from "./base.repository.js";

class AuthorizationRepository extends BaseRepository<Authorization, AuthorizationData, any> {
    constructor() {
        super(prisma.authorizations, "AUTHORIZATION");
    }

    
}