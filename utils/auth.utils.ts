import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { logger } from "./logger.util.js";
import { ServerError } from "./error.utils.js";
import { errorMessage } from "../constants/error.constants.js";
import type { Role } from "../generated/prisma/enums.js";

class AuthUtilsClass {
    comparePasswords = async (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    }

    generateAccessToken = (id: string, role: string) => {
        return jwt.sign({ id, role }, config.jwtSecret as string, { expiresIn: "15m" });
    }

    generateForgetToken = (id: string) => {
        return jwt.sign({ id }, config.jwtSecret as string, { expiresIn: "15m" });
    }

    decodeForgetToken = (token: string) => {
        try {
            return jwt.verify(token, config.jwtSecret as string) as { id: string }
        } catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });

            throw new ServerError(errorMessage.INVALIDDATA);
        }

    }

    decodeAccesstoken = (token: string) => {
        try {
            return jwt.verify(token, config.jwtSecret as string) as { id: string, role: Role }
        } catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });

            throw new ServerError(errorMessage.INVALIDDATA);
        }
    }

    hashPassword = async (password: string) => {
        return await bcrypt.hash(password, 10);
    }
}

export { AuthUtilsClass }