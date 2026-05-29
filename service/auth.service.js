import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import { authUtils } from "../factory/utils.factory.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import crypto from "crypto";
class AuthService {
    AuthMethods;
    UserMethods;
    AuthorizationMethods;
    constructor(AuthMethods, UserMethods, AuthorizationMethods) {
        this.AuthMethods = AuthMethods;
        this.UserMethods = UserMethods;
        this.AuthorizationMethods = AuthorizationMethods;
    }
    login = async (username, password) => {
        const user = await this.UserMethods.fetch(undefined, username, undefined);
        if (!user.id) {
            logger.warn("No user found", {
                username
            });
            throw new ServerError(errorMessage.NOTFOUND);
        }
        if (!await authUtils.comparePasswords(password, user.password)) {
            logger.warn("Login failed: Incorrect password", {
                userId: user.id
            });
            throw new ServerError(errorMessage.INVALIDDATA);
        }
        const access = await this.AuthorizationMethods.fetchAuth(user.id);
        const accessToken = authUtils.generateAccessToken(user.id, user.role, access);
        const familyId = crypto.randomUUID();
        const refreshToken = await this.AuthMethods.create({ familyId, userId: user.id, role: user.role });
        return { refreshToken: refreshToken.id, accessToken, id: user.id, role: user.role, access };
    };
    logout = async (refreshTokenId, flag) => {
        await this.AuthMethods.delete(refreshTokenId, flag);
        logger.info("User logged out");
    };
    generateCredentials = async (refreshTokenId) => {
        const refreshToken = await this.AuthMethods.fetch(refreshTokenId);
        if (!refreshToken) {
            logger.warn("Invalid refresh token id");
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        if (refreshToken.isUsed) {
            await prisma.refreshTokens.deleteMany({
                where: {
                    userId: refreshToken.userId
                }
            });
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        const access = await this.AuthorizationMethods.fetchAuth(refreshToken.userId);
        const accessToken = authUtils.generateAccessToken(refreshToken.userId, refreshToken.role, access);
        const familyId = refreshToken.familyId;
        const newRefreshToken = await this.AuthMethods.create({ familyId, userId: refreshToken.userId, role: refreshToken.role });
        await prisma.refreshTokens.delete({
            where: {
                id: refreshTokenId
            }
        });
        return { accessToken, refreshToken: newRefreshToken, access };
    };
    fetchState = async (accessToken) => {
        const { id, role } = authUtils.decodeAccesstoken(accessToken);
        if (!id || !role) {
            logger.warn(errorMessage.UNAUTHORIZED.message);
            throw new ServerError(errorMessage.UNAUTHORIZED);
        }
        const access = await this.AuthorizationMethods.fetchAuth(id);
        return { id, role, access };
    };
}
export { AuthService };
//# sourceMappingURL=auth.service.js.map