import { PaginationData } from "../dto/pagination.dto.js";
/**
 * Abstract Base Service providing business logic orchestration.
 * Handles logging, Redis cache invalidation, and Repository interaction.
 */
declare abstract class BaseService<T, TData, TMethods> {
    protected method: TMethods;
    protected modelName: string;
    constructor(method: TMethods, modelName: string);
    /**
     * Propagates a database transaction to the repository level.
     * Creates a cloned service instance with a transaction-scoped repository.
     *
     * @param TxClient - The Prisma transaction delegate.
     * @returns {this} A new service instance bound to the transaction.
     */
    tx(TxClient: any): this;
    /**
     * Orchestrates record creation and triggers cache invalidation.
     *
     * @param data - The payload to create the record.
     * @returns {Promise<T>} The newly created record.
     */
    create: (data: TData) => Promise<T>;
    /**
     * Orchestrates multiple records creation.
     *
     * @param data - Array of payloads to create.
     * @returns {Promise<T[]>} Array of newly created records.
     */
    createMany: (data: TData[]) => Promise<T[]>;
    /**
     * Fetches a single record and validates existence.
     *
     * @param id - The unique identifier of the record.
     * @param userId - Optional owner ID for access control.
     * @returns {Promise<T>} The validated record.
     * @throws {serverError} 404 error if record is missing or malformed.
     */
    fetch: (id: string, userId?: string) => Promise<T>;
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
    update: (data: any, id: string, userId?: string) => Promise<T>;
    /**
     * Orchestrates record deletion (Soft or Hard) and clears cache.
     *
     * @param id - The unique identifier of the record.
     * @param flag - Boolean toggle: true for hard delete, false for soft delete.
     * @returns {Promise<T>} The deleted/deactivated record metadata.
     */
    delete: (id: string) => Promise<T>;
}
export { BaseService };
//# sourceMappingURL=base.service.d.ts.map