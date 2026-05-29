import type { ReportRespository } from "../repository/report.repository.js";
declare class ReportService {
    private ReportMethods;
    constructor(ReportMethods: ReportRespository);
    fetchDashData: (data: any) => Promise<{
        totalPayments: number;
        totalRevenue: number;
        totalProjects: number;
    }[]>;
}
export { ReportService };
//# sourceMappingURL=report.service.d.ts.map