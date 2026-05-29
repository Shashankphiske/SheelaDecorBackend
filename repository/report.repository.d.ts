declare class ReportRespository {
    fetchDashData: (data: any) => Promise<{
        totalPayments: number;
        totalRevenue: number;
        totalProjects: number;
    }[]>;
}
export { ReportRespository };
//# sourceMappingURL=report.repository.d.ts.map