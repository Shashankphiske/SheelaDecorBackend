import { ApiResponse } from "../utils/api.utils.js";
class ReportController {
    ReportService;
    constructor(ReportService) {
        this.ReportService = ReportService;
    }
    fetchDashData = async (req, res) => {
        const data = await this.ReportService.fetchDashData({
            ...(req.query.startDate && { startDate: new Date(req.query.startDate?.toString() ?? "") }),
            ...(req.query.endDate && { endDate: new Date(req.query.endDate?.toString() ?? "") })
        });
        return ApiResponse.success(res, "fetched", data);
    };
}
export { ReportController };
//# sourceMappingURL=report.controller.js.map