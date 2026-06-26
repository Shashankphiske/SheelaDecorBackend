import type { NextFunction, Request, Response } from "express"
import { logger } from "./logger.util.js";
import { ApiResponse } from "./api.utils.js";
import { CookieOptions } from "../dto/token.dto.js";
import { Prisma } from "../generated/prisma/client.js";

class ErrorHandler {
    wrapper = (fn: any) => {
        return (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        }
    }
}

class GlobalErrorHandler {
    handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.stack || err.message || err, {
            status: err.status ?? 500,
            ip: req.ip
        });

        if (err.status == 403) {
            res.clearCookie("accessToken", CookieOptions);
            res.clearCookie("refreshToken", CookieOptions);
        }

        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            let status = 400;
            let message = "Please provide valid data";
            if (err.code === 'P2025') {
                status = 404;
                message = "Resource not found!";
            } else if (err.code === 'P2003') {
                status = 400;
                message = "Please provide valid data (reference constraint violated)";
            } else if (err.code === 'P2002') {
                status = 409;
                message = "The provided data is already taken";
            }
            return ApiResponse.error(res, message, status);
        }

        const status = err.status ?? 500;
        const responseMessage = status === 500
            ? "Something went wrong on the server. Please try again later."
            : err.message;

        return ApiResponse.error(res, responseMessage, status);
    }
}

interface LogError {
    status: number,
    message: string
}

class ServerError extends Error {
    public status: number;

    constructor(errorData: LogError) {
        super(errorData.message);
        this.status = errorData.status;
        this.message = errorData.message;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

export { GlobalErrorHandler, ErrorHandler, ServerError }