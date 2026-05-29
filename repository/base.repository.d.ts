import type { PaginationData } from "../dto/pagination.dto.js";
/**
 * Abstract Base Repository providing generic CRUD operations using Prisma.
 *
 * @template T - The primary model type.
 * @template TCreateData - Type for creating a new record.
 * @template TUpdateData - Type for updating an existing record.
 */
export declare abstract class BaseRepository<T, TCreateData, TUpdateData> {
    protected model: any;
    protected modelName: string;
    constructor(model: any | undefined, modelName: string, config?: {
        primaryKey?: string;
        statusField?: string;
        hasCreatedAt?: boolean;
    });
    protected config: {
        primaryKey: string;
        statusField: string;
        hasCreatedAt: boolean;
    };
    /**
     * Maps Prisma-specific known request errors to custom server errors.
     * @param error - The error caught from a Prisma operation.
     * @throws {serverError} Corresponding to P2025 (Not Found), P2003 (Foreign Key), or P2002 (Unique).
     * @private
     */
    handlePrismaError(error: any): never;
    /**
     * Swaps the current database model with a transaction-scoped client.
     * @param txModel - The Prisma transaction delegate.
     * @returns A new instance of the repository bound to the transaction.
     */
    tx(txModel: any): this;
    /**
     * Creates a new record in the database.
     * @param data - The data required to create the record.
     * @returns {Promise<T>} The created record.
     * @throws {serverError} If a unique constraint or foreign key check fails.
     */
    create: (data: TCreateData) => Promise<T>;
    /**
     * Creates multiple records inside a transaction.
     * @param data - Array of payloads to insert.
     * @returns {Promise<T[]>} Array of created records.
     */
    createMany: (data: TCreateData[]) => Promise<T[]>;
    /**
     * Retrieves a single record by its primary key.
     * @param id - The unique identifier of the record.
     * @param userId - Optional owner ID to restrict the fetch.
     * @returns {Promise<T>} The found record or an empty object cast as T.
     */
    fetch: (id: string, userId?: string) => Promise<T>;
    /**
     * Fetches multiple records based on pagination, filters, and search criteria.
     * @param data - Pagination and sorting metadata.
     * @param filters - Key-value pairs for where-clause filtering.
     * @param searchFields - List of model fields to apply search logic to.
     * @returns {Promise<T[]>} An array of retrieved records.
     */
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<T[]>;
    /**
     * Updates an existing record.
     * @param data - The fields to update.
     * @param id - The unique identifier of the record to update.
     * @returns {Promise<T>} The updated record.
     * @throws {serverError} If the record is not found or validation fails.
     */
    update: (data: TUpdateData, id: string, userId?: string) => Promise<void>;
    /**
     * Performs a logical delete by setting a timestamp on the status/deletedAt field.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The record with the updated deletion timestamp.
     * @throws {serverError} If the record is already deleted or doesn't exist.
     */
    softDelete: (id: string, userId?: string) => Promise<T>;
    /**
     * Permanently removes a record from the database.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The deleted record metadata.
     * @throws {serverError} If the record does not exist.
     */
    hardDelete: (id: string, userId?: string) => Promise<void>;
}
//# sourceMappingURL=base.repository.d.ts.map