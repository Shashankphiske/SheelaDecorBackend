import { errorMessage } from "../constants/error.constants.js";
import type { User, UserData } from "../dto/user.dto.js";
import { authUtils } from "../factory/utils.factory.js";
import type { UserRepository } from "../repository/user.repository.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseService } from "./base.service.js";

class UserService extends BaseService<User, UserData, any> {
    constructor(method: UserRepository) {
        super(method, "USER");
    }

    create = async (data: UserData) => {
        const hashedPassword = await authUtils.hashPassword(data.password);
        const user = await this.method.create({ ...data, password: hashedPassword, role: data.role ? data.role : "USER" });

        logger.info("User created", {
            userId: user.id
        });

        return user;
    }

    fetch = async (id?: string, username?: string, email?: string) => {
        const user = await this.method.fetch(id = id, username = username, email = email);

        if(!user.id) {
            logger.warn("User not found", {
                id, username, email
            });

            throw new ServerError(errorMessage.NOTFOUND);
        }

        logger.info("User fetched" , {
            userId: user.id
        })

        return user;
    }

    forgetPass = async (id?: string, username?: string, email?: string) => {
        const user = await this.method.fetch(id = id, username = username, email = email);
        if(!user.id) {
            logger.warn("User not found", {
                email
            });

            throw new ServerError(errorMessage.NOTFOUND);
        }

        const token = authUtils.generateForgetToken(user.id);

        logger.info("Forget password token generated", {
            userId: user.id
        });

        return token;
    }

    changePass = async (token: string, password: string) => {
        const { id } = authUtils.decodeForgetToken(token);

        const hashedPassword = await authUtils.hashPassword(password);

        const user = await this.method.update({ password: hashedPassword }, id);

        logger.info("User password changed", {
            userId: id
        });

        return user;
    }
}

export { UserService };