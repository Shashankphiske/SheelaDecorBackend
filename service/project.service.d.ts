import type { PaginationData } from "../dto/pagination.dto.js";
import type { ProjectRepository } from "../repository/project.repository.js";
declare class ProjectService {
    private method;
    constructor(method: ProjectRepository);
    create: (projectData: any) => Promise<any>;
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
    /**
     * Fetches a paginated list of records and generates a pagination cursor.
     *
     * @param data - Pagination, sorting, and limit parameters.
     * @param filters - Dynamic query filters.
     * @param searchFields - Model fields to include in the search.
     * @returns {Promise<{records: T[], nextCursor: object}>} List of records and metadata for subsequent fetches.
     * @throws {serverError} 404 error if no records match the criteria.
     */
    fetchAll: (data: PaginationData, filters: {}, searchFields: string[]) => Promise<{
        records: any;
        nextCursor: {
            lastId: any;
            lastCreatedAt: any;
        };
    }>;
    /**
     * Updates a record and clears relevant cache keys.
     *
     * @param data - The update payload.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The updated record.
     */
    update: (data: any, id: string, userId?: string) => Promise<{
        id: string;
    }>;
    updateStatus: (id: string, status: any) => Promise<void>;
    /**
     * Orchestrates record deletion (Soft or Hard) and clears cache.
     *
     * @param id - The unique identifier of the record.
     * @param flag - Boolean toggle: true for hard delete, false for soft delete.
     * @returns {Promise<T>} The deleted/deactivated record metadata.
     */
    delete: (id: string) => Promise<void>;
}
export { ProjectService };
//# sourceMappingURL=project.service.d.ts.map