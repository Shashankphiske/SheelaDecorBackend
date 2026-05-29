import type { Authorization, AuthorizationData } from "../dto/authorization.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class AuthorizationRepository extends BaseRepository<Authorization, AuthorizationData, any> {
    constructor();
    create: (data: any) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
    update: (data: any, id: string, userId?: string) => Promise<any>;
    fetchAuth: (userId: string) => Promise<any>;
}
export { AuthorizationRepository };
//# sourceMappingURL=authorization.repository.d.ts.map