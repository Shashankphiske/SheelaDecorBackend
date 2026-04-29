import type { Request, Response } from "express";
import type { ReportService } from "../service/report.service.js";
import { ApiResponse } from "../utils/api.utils.js";

class ReportController {
    constructor(private ReportService: ReportService) {}

    fetchDashData = async (req: Request, res: Response) => {
        const data = await this.ReportService.fetchDashData({
            ...(req.query.startDate && {startDate: new Date(req.query.startDate?.toString() ?? "")}),
            ...(req.query.endDate && { endDate: new Date(req.query.endDate?.toString() ?? "") })
        });

        return ApiResponse.success(res, "fetched", data);
    }
}

export { ReportController }