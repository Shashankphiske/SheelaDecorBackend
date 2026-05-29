import type { PaginationData } from "../dto/pagination.dto.js";
declare class ProjectRepository {
    private handlePrismaError;
    create: (data: any) => Promise<{
        id: string;
        createdAt: Date;
        status: import("../generated/prisma/enums.js").ProjectStatus;
        paid: import("@prisma/client-runtime-utils").Decimal | null;
        creator: {
            username: string;
        };
    }>;
    fetch: (id: string) => Promise<({
        creator: {
            username: string;
        };
        customer: {
            id: string;
            createdAt: Date;
            email: string | null;
            phonenumber: string;
            address: string | null;
            alternatePhonenumber: string | null;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        address: string | null;
        name: string;
        customerId: string | null;
        creatorId: string;
        status: import("../generated/prisma/enums.js").ProjectStatus;
        totalAmount: import("@prisma/client-runtime-utils").Decimal | null;
        totalTax: import("@prisma/client-runtime-utils").Decimal | null;
        paid: import("@prisma/client-runtime-utils").Decimal | null;
        discount: import("@prisma/client-runtime-utils").Decimal | null;
        discountType: string | null;
        projectDate: Date;
        additionalRequests: string | null;
        bankId: string | null;
    }) | null>;
    markAsDefaulter: (id: string) => Promise<void>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
    update: (data: any, id: string, userId?: string) => Promise<{
        id: string;
    }>;
    updateStatus: (id: string, status: any) => Promise<void>;
    delete: (id: string, userId?: string) => Promise<void>;
}
export { ProjectRepository };
//# sourceMappingURL=project.repository.d.ts.map