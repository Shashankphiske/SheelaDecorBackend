import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import type { AuthorizationRepository } from "../repository/authorization.repository.js";
import { BaseService } from "./base.service.js";

class AuthorizationService extends BaseService<Authorization, AuthorizationData, any> {
    constructor(methods: AuthorizationRepository) {
        super(methods, "AUTHORIZATION");
    }
}

export {  AuthorizationService}