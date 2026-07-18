import type { ReportRespository } from "../repository/report.repository.js";

class ReportService {
    constructor(private ReportMethods: ReportRespository) {}

    fetchDashData = async (data: any) => {
        const total = await this.ReportMethods.fetchDashData(data);
        return total;
    };

    getProjectsReport = async (data: any) => {
        return await this.ReportMethods.getProjectsReport(data);
    };

    getPaymentsReport = async (data: any) => {
        return await this.ReportMethods.getPaymentsReport(data);
    };

    getInteriorsReport = async (data: any) => {
        return await this.ReportMethods.getInteriorsReport(data);
    };

    getProductsReport = async (data: any) => {
        return await this.ReportMethods.getProductsReport(data);
    };
}

export { ReportService };