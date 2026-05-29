import type { Role } from "../generated/prisma/enums.js";
declare class AuthUtilsClass {
    comparePasswords: (password: string, hashedPassword: string) => Promise<boolean>;
    generateAccessToken: (id: string, role: string, access: string[]) => string;
    generateForgetToken: (id: string) => string;
    decodeForgetToken: (token: string) => {
        id: string;
    };
    decodeAccesstoken: (token: string) => {
        id: string;
        role: Role;
        access: string[];
    };
    hashPassword: (password: string) => Promise<string>;
}
export { AuthUtilsClass };
//# sourceMappingURL=auth.utils.d.ts.map