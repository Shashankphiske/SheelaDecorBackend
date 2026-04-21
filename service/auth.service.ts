import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import { authUtils } from "../factory/utils.factory.js";
import type { AuthRepository } from "../repository/auth.repository.js"
import type { AuthorizationRepository } from "../repository/authorization.repository.js";
import type { UserRepository } from "../repository/user.repository.js"
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import crypto from "crypto"

class AuthService {

    constructor(private AuthMethods: AuthRepository, private UserMethods: UserRepository, private AuthorizationMethods: AuthorizationRepository) {}

    login = async (username: string, password: string) => {
        const user = await this.UserMethods.fetch(undefined, username, undefined);
        if(!user.id) {
            logger.warn("No user found", {
                username
            });

            throw new ServerError(errorMessage.NOTFOUND);
        }

        if(!await authUtils.comparePasswords(password, user.password)) {
            logger.warn("Login failed: Incorrect password", {
                userId: user.id
            });

            throw new ServerError(errorMessage.INVALIDDATA);
        }

        const accessToken = authUtils.generateAccessToken(user.id, user.role);
        const familyId = crypto.randomUUID();
        const refreshToken = await this.AuthMethods.create({ familyId, userId: user.id, role: user.role });

        return { refreshToken: refreshToken.id, accessToken, id: user.id, role: user.role };
    }

    logout = async (refreshTokenId: string, flag: boolean) => {
        
        await this.AuthMethods.delete(refreshTokenId, flag );
    
        logger.info("User logged out");
    }

    generateCredentials = async (refreshTokenId: string) => {
        const refreshToken = await this.AuthMethods.fetch(refreshTokenId);
        if(!refreshToken) {
            logger.warn("Invalid refresh token id");

            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        if(refreshToken.isUsed) {
            await prisma.refreshTokens.deleteMany({
                where : {
                    userId: refreshToken.userId
                }
            });

            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        const accessToken = authUtils.generateAccessToken(refreshToken.id, refreshToken.role);
        const familyId = refreshToken.familyId;
        const newRefreshToken = await this.AuthMethods.create({ familyId, userId: refreshToken.userId, role: refreshToken.role });       

        return { accessToken, refreshToken: newRefreshToken };
    }

    fetchState = async (accessToken: string) => {
        const { id, role } = authUtils.decodeAccesstoken(accessToken);

        if(!id || !role) {
            logger.warn(errorMessage.UNAUTHORIZED.message);

            throw new ServerError(errorMessage.UNAUTHORIZED);
        }

        const access = await this.AuthorizationMethods.fetchAuth(id);
        return { id, role, access };
    }
}

export { AuthService }