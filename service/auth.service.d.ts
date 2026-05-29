import type { AuthRepository } from "../repository/auth.repository.js";
import type { AuthorizationRepository } from "../repository/authorization.repository.js";
import type { UserRepository } from "../repository/user.repository.js";
declare class AuthService {
    private AuthMethods;
    private UserMethods;
    private AuthorizationMethods;
    constructor(AuthMethods: AuthRepository, UserMethods: UserRepository, AuthorizationMethods: AuthorizationRepository);
    login: (username: string, password: string) => Promise<{
        refreshToken: string;
        accessToken: string;
        id: string;
        role: "USER" | "ADMIN" | "INTERIOR" | "SALES_ASSOCIATE";
        access: any;
    }>;
    logout: (refreshTokenId: string, flag: boolean) => Promise<void>;
    generateCredentials: (refreshTokenId: string) => Promise<{
        accessToken: string;
        refreshToken: {
            id: string;
            userId: string;
            role: import("../generated/prisma/enums.js").Role;
            familyId: string;
            isUsed: boolean;
        };
        access: any;
    }>;
    fetchState: (accessToken: string) => Promise<{
        id: string;
        role: import("../generated/prisma/enums.js").Role;
        access: any;
    }>;
}
export { AuthService };
//# sourceMappingURL=auth.service.d.ts.map