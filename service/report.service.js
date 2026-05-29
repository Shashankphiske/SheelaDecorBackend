class ReportService {
    ReportMethods;
    constructor(ReportMethods) {
        this.ReportMethods = ReportMethods;
    }
    fetchDashData = async (data) => {
        const total = await this.ReportMethods.fetchDashData(data);
        return total;
    };
}
export { ReportService };
//# sourceMappingURL=report.service.js.map