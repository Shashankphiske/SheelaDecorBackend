import { sendMail } from "../config/mail.js";
import { errorMessage } from "../constants/error.constants.js";
import { resetPasswordTemplate } from "../dto/mail.dto.js";
import { authUtils } from "../factory/utils.factory.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseService } from "./base.service.js";
import { prisma } from "../db/prisma.js";
class UserService extends BaseService {
    constructor(method) {
        super(method, "USER");
    }
    create = async (data) => {
        const hashedPassword = await authUtils.hashPassword(data.password);
        const user = await this.method.create({ ...data, password: hashedPassword, role: data.role ? data.role : "USER" });
        const defaultAccess = [
            "products", "brands", "catalogues", "interiors", "artisans",
            "sales-associate", "stitching", "stores", "areas", "dealers",
            "orders", "measurements", "clothCalculation", "customers"
        ];
        await prisma.authorizations.createMany({
            data: defaultAccess.map(key => ({
                userId: user.id,
                access: key
            })),
            skipDuplicates: true
        });
        logger.info("User created with default master and customer page access", {
            userId: user.id
        });
        return user;
    };
    fetch = async (id, username, email) => {
        const user = await this.method.fetch(id = id, username = username, email = email);
        if (!user.id) {
            logger.warn("User not found", {
                id, username, email
            });
            throw new ServerError(errorMessage.NOTFOUND);
        }
        logger.info("User fetched", {
            userId: user.id
        });
        return { ...user, password: null };
    };
    forgetPass = async (id, username, email) => {
        const user = await this.method.fetch(id = id, username = username, email = email);
        if (!user.id) {
            logger.warn("User not found", {
                email
            });
            throw new ServerError(errorMessage.NOTFOUND);
        }
        const token = authUtils.generateForgetToken(user.id);
        logger.info("Forget password token generated", {
            userId: user.id
        });
        await sendMail(user.email, "Sheela Decor - Change Password", resetPasswordTemplate(user.username, `https://sheeladecorfrontend.netlify.app/change-pass/${token}`));
        return;
    };
    changePass = async (token, password) => {
        const { id } = authUtils.decodeForgetToken(token);
        const hashedPassword = await authUtils.hashPassword(password);
        const user = await this.method.update({ password: hashedPassword }, id);
        logger.info("User password changed", {
            userId: id
        });
        return user;
    };
}
export { UserService };
//# sourceMappingURL=user.service.js.map