import { prisma } from "../db/prisma.js"

class ReportRespository {
    fetchDashData = async (data: any) => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // 1. Pre-calculate dates once
        const start = data?.startDate ? new Date(data.startDate) : (now.getMonth() >= 3 ? new Date(currentYear, 3, 1) : new Date(currentYear - 1, 3, 1));
        const end = data?.endDate ? new Date(data.endDate) : (now.getMonth() >= 3 ? new Date(currentYear + 1, 2, 31, 23, 59, 59) : new Date(currentYear, 2, 31, 23, 59, 59));

        const dateRange = { gte: start, lte: end };

        // 2. Run independent queries in parallel (faster than awaiting one by one)
        const [payments, revenue, projects] = await Promise.all([
            prisma.payments.aggregate({
                _sum: { amount: true },
                where: { createdAt: dateRange }
            }),
            prisma.projects.aggregate({
                _sum: { totalAmount: true },
                where: { createdAt: dateRange }
            }),
            prisma.projects.count({
                where: {
                    createdAt: dateRange,
                    status: { not: "COMPLETED" }
                }
            })
        ]);

        let records: any;

        return records =  [
            {
                totalPayments: Number(payments._sum.amount ?? 0),
                totalRevenue: Number(revenue._sum.totalAmount ?? 0),
                totalProjects: projects // .count() returns a number automatically
            }
        ];
    }
}

export { ReportRespository }
