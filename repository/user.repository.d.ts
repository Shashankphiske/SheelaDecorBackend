import type { User, UserData } from "../dto/user.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class UserRepository extends BaseRepository<User, UserData, any> {
    constructor();
    create: (data: UserData) => Promise<any>;
    fetch: (id?: string, username?: string, email?: string) => Promise<User>;
}
export { UserRepository };
//# sourceMappingURL=user.repository.d.ts.map