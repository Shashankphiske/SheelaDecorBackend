import type { Request, Response } from "express";
import type { ReportService } from "../service/report.service.js";
declare class ReportController {
    private ReportService;
    constructor(ReportService: ReportService);
    fetchDashData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export { ReportController };
//# sourceMappingURL=report.controller.d.ts.map