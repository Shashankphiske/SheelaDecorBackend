import type { User, UserData } from "../dto/user.dto.js";
import type { UserRepository } from "../repository/user.repository.js";
import { BaseService } from "./base.service.js";
declare class UserService extends BaseService<User, UserData, any> {
    constructor(method: UserRepository);
    create: (data: UserData) => Promise<any>;
    fetch: (id?: string, username?: string, email?: string) => Promise<any>;
    forgetPass: (id?: string, username?: string, email?: string) => Promise<void>;
    changePass: (token: string, password: string) => Promise<any>;
}
export { UserService };
//# sourceMappingURL=user.service.d.ts.map