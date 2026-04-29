import type { ReportRespository } from "../repository/report.repository.js";

class ReportService {
    constructor(private ReportMethods: ReportRespository) {}

    fetchDashData = async (data: any) => {
        const total = await this.ReportMethods.fetchDashData(data);

        return total;
    }
}

export { ReportService }