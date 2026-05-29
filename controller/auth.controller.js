import { logger } from "../utils/logger.util.js";
import { ApiResponse } from "../utils/api.utils.js";
import { CookieOptions } from "../dto/token.dto.js";
class AuthController {
    service;
    constructor(service) {
        this.service = service;
    }
    login = async (req, res) => {
        logger.http("Login request received", {
            ip: req.ip
        });
        const { accessToken, refreshToken, id, role, access } = await this.service.login(req.body.username, req.body.password);
        res.cookie("accessToken", accessToken, { sameSite: "none", secure: true, partitioned: true, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { sameSite: "none", secure: true, partitioned: true, httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        return ApiResponse.success(res, "Logged in", { id, role, access });
    };
    logout = async (req, res) => {
        logger.http("Logout request received", {
            ip: req.ip
        });
        await this.service.logout(req.cookies.refreshToken, req.params.flag?.toString() == "true" ? true : false);
        res.clearCookie("accessToken", CookieOptions);
        res.clearCookie("refreshToken", CookieOptions);
        return ApiResponse.success(res, "Logged out");
    };
    fetchState = async (req, res) => {
        logger.http("Fetch state request received", {
            ip: req.ip
        });
        const data = await this.service.fetchState(req.cookies.accessToken);
        return ApiResponse.success(res, "State fetched", data);
    };
}
export { AuthController };
//# sourceMappingURL=auth.controller.js.map