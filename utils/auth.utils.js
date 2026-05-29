import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { logger } from "./logger.util.js";
import { ServerError } from "./error.utils.js";
import { errorMessage } from "../constants/error.constants.js";
class AuthUtilsClass {
    comparePasswords = async (password, hashedPassword) => {
        return bcrypt.compare(password, hashedPassword);
    };
    generateAccessToken = (id, role, access) => {
        return jwt.sign({ id, role, access }, config.jwtSecret, { expiresIn: "7d" } // Changed from "15m" to "7d"
        );
    };
    generateForgetToken = (id) => {
        return jwt.sign({ id }, config.jwtSecret, { expiresIn: "15m" });
    };
    decodeForgetToken = (token) => {
        try {
            return jwt.verify(token, config.jwtSecret);
        }
        catch (err) {
            logger.warn("Invalid token provided", {
                token: token
            });
            throw new ServerError(errorMessage.INVALIDDATA);
        }
    };
    decodeAccesstoken = (token) => {
        try {
            // Strip "Bearer " if it exists
            const actualToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
            return jwt.verify(actualToken, config.jwtSecret);
        }
        catch (err) {
            // Log the actual JWT error (e.g., "jwt expired" or "invalid signature")
            logger.warn(`JWT Error: ${err.message}`, { token: token.substring(0, 15) });
            throw new ServerError(errorMessage.INVALIDDATA);
        }
    };
    hashPassword = async (password) => {
        return await bcrypt.hash(password, 10);
    };
}
export { AuthUtilsClass };
//# sourceMappingURL=auth.utils.js.map