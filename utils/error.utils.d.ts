import type { NextFunction, Request, Response } from "express";
declare class ErrorHandler {
    wrapper: (fn: any) => (req: Request, res: Response, next: NextFunction) => void;
}
declare class GlobalErrorHandler {
    handleError: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
}
interface LogError {
    status: number;
    message: string;
}
declare class ServerError extends Error {
    status: number;
    constructor(errorData: LogError);
}
export { GlobalErrorHandler, ErrorHandler, ServerError };
//# sourceMappingURL=error.utils.d.ts.map