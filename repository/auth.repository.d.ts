import type { TokenData } from "../dto/token.dto.js";
declare class AuthRepository {
    create: (data: TokenData) => Promise<{
        id: string;
        userId: string;
        role: import("../generated/prisma/enums.js").Role;
        familyId: string;
        isUsed: boolean;
    }>;
    fetch: (id: string) => Promise<{
        id: string;
        userId: string;
        role: import("../generated/prisma/enums.js").Role;
        familyId: string;
        isUsed: boolean;
    } | null>;
    update: (isUsed: boolean, id: string) => Promise<{
        id: string;
        userId: string;
        role: import("../generated/prisma/enums.js").Role;
        familyId: string;
        isUsed: boolean;
    }>;
    delete: (id: string, flag: boolean) => Promise<void>;
}
export { AuthRepository };
//# sourceMappingURL=auth.repository.d.ts.map