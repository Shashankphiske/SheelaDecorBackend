import { errorMessage } from "../constants/error.constants.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { PaginationData } from "../dto/pagination.dto.js";
import { redisUtils } from "../factory/utils.factory.js";

/**
 * Abstract Base Service providing business logic orchestration.
 * Handles logging, Redis cache invalidation, and Repository interaction.
 */
abstract class BaseService<T, TData, TMethods> {
    constructor(protected method: TMethods, protected modelName: string) { }

    /**
     * Propagates a database transaction to the repository level.
     * Creates a cloned service instance with a transaction-scoped repository.
     * 
     * @param TxClient - The Prisma transaction delegate.
     * @returns {this} A new service instance bound to the transaction.
     */
    tx(TxClient: any): this {
        const instance = Object.create(Object.getPrototypeOf(this))
        Object.assign(instance, this)
        // @ts-ignore
        instance.methods = this.method.tx(TxClient);

        return instance;
    }


    /**
     * Orchestrates record creation and triggers cache invalidation.
     * 
     * @param data - The payload to create the record.
     * @returns {Promise<T>} The newly created record.
     */
    create = async (data: TData): Promise<T> => {
        //@ts-ignore
        const record = await this.method.create(data);
        logger.info(`${this.modelName} created`, {
            id: record.id,
        });

        redisUtils.invalidateKey(record.userId ? record.userId : "PUBLIC", this.modelName, "CREATE");

        return record;
    }

    /**
     * Fetches a single record and validates existence.
     * 
     * @param id - The unique identifier of the record.
     * @param userId - Optional owner ID for access control.
     * @returns {Promise<T>} The validated record.
     * @throws {serverError} 404 error if record is missing or malformed.
     */
    fetch = async (id: string, userId?: string): Promise<T> => {
        //@ts-ignore

        const record = await this.method.fetch(id, userId);
        if (!record || !record.id) {
            logger.warn(`No ${this.modelName} found`, {
                id
            });

            throw new ServerError(errorMessage.NOTFOUND);
        }

        logger.info(`${this.modelName} fetched`, {
            id
        });

        return record;
    }

    /**
     * Fetches a paginated list of records and generates a pagination cursor.
     * 
     * @param data - Pagination, sorting, and limit parameters.
     * @param filters - Dynamic query filters.
     * @param searchFields - Model fields to include in the search.
     * @returns {Promise<{records: T[], nextCursor: object}>} List of records and metadata for subsequent fetches.
     * @throws {serverError} 404 error if no records match the criteria.
     */
    fetchAll = async (data: PaginationData, filters: {}, searchFields: string[]) => {
        //@ts-ignore

        const records = await this.method.fetchAll(data, filters, searchFields);

        if (records.length == 0) {
            logger.warn(`No ${this.modelName} records found`);

            throw new ServerError(errorMessage.NOTFOUND);
        }

        const lastRecord = records[records.length - 1] as any;

        logger.info(`${this.modelName} records fetched`);

        return {
            records, nextCursor: {
                lastId: lastRecord.id,
                lastCreatedAt: lastRecord.createdAt
            }
        };
    }

    /**
     * Updates a record and clears relevant cache keys.
     * 
     * @param data - The update payload.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The updated record.
     */
    update = async (data: any, id: string, userId?: string): Promise<T> => {
        //@ts-ignore

        const record = await this.method.update(data, id);

        logger.info(`${this.modelName} record updated`, {
            id
        });

        redisUtils.invalidateKey(record.userId ? record.userId : "PUBLIC", this.modelName, "UPDATE");

        return record;
    }

    /**
     * Orchestrates record deletion (Soft or Hard) and clears cache.
     * 
     * @param id - The unique identifier of the record.
     * @param flag - Boolean toggle: true for hard delete, false for soft delete.
     * @returns {Promise<T>} The deleted/deactivated record metadata.
     */
    delete = async (id: string): Promise<T> => {
        // @ts-ignore
        const record = await this.method.hardDelete(id);
        logger.info(`${this.modelName} record hard deleted`, { id });

        redisUtils.invalidateKey("PUBLIC", this.modelName, "DELETE");

        return record;
    }
}

export { BaseService };