import type { Response } from "express";
declare class ApiResponse {
    success: boolean;
    message: string;
    data: any;
    private constructor();
    static success(res: Response, message: string, data?: any, status?: number): Response<any, Record<string, any>>;
    static error(res: Response, message: string, status?: number): Response<any, Record<string, any>>;
}
export { ApiResponse };
//# sourceMappingURL=api.utils.d.ts.map