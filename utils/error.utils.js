import { logger } from "./logger.util.js";
import { ApiResponse } from "./api.utils.js";
class ErrorHandler {
    wrapper = (fn) => {
        return (req, res, next) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };
    };
}
class GlobalErrorHandler {
    handleError = (err, req, res, next) => {
        logger.error(err.message, {
            status: err.status,
            ip: req.ip
        });
        if (err.status == 403) {
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
        }
        const status = err.status ?? 500;
        return ApiResponse.error(res, err.message, status);
    };
}
class ServerError extends Error {
    status;
    constructor(errorData) {
        super(errorData.message);
        this.status = errorData.status;
        this.message = errorData.message;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
export { GlobalErrorHandler, ErrorHandler, ServerError };
//# sourceMappingURL=error.utils.js.map