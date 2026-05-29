import { prisma } from "../db/prisma.js";
import { BaseRepository } from "./base.repository.js";
class UserRepository extends BaseRepository {
    constructor() {
        super(prisma.users, "USER");
    }
    create = async (data) => {
        const user = await prisma.users.create({
            data: data,
            select: {
                id: true,
                createdAt: true
            }
        });
        return user;
    };
    fetch = async (id, username, email) => {
        const user = await prisma.users.findFirst({
            where: {
                ...(id ? { id } : {}),
                ...(username ? { username } : {}),
                ...(email ? { email } : {})
            },
            include: {
                auth: true
            }
        });
        return user ?? {};
    };
}
export { UserRepository };
//# sourceMappingURL=user.repository.js.map