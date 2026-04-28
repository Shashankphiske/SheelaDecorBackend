import { errorMessage } from "../constants/error.constants.js";
import { prisma } from "../db/prisma.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { Prisma } from "../generated/prisma/client.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { serverUtils } from "../utils/server.utils.js";



interface RepoConfig {
    primaryKey: string,
    statusField: string,
    hasCreatedAt: boolean,   // ← add
}


/**
 * Abstract Base Repository providing generic CRUD operations using Prisma.
 * 
 * @template T - The primary model type.
 * @template TCreateData - Type for creating a new record.
 * @template TUpdateData - Type for updating an existing record.
 */
export abstract class BaseRepository<T, TCreateData, TUpdateData> {

    // In constructor:
    constructor(
        protected model: any = prisma,
        protected modelName: string,
        config: { primaryKey?: string; statusField?: string; hasCreatedAt?: boolean } = {}  // ← add
    ) {
        this.config = {
            primaryKey: "id",
            statusField: "",
            hasCreatedAt: true,   // ← default true so existing repos need no changes
            ...config
        }
    }

    protected config: { primaryKey: string; statusField: string; hasCreatedAt: boolean };
    /**
     * Maps Prisma-specific known request errors to custom server errors.
     * @param error - The error caught from a Prisma operation.
     * @throws {serverError} Corresponding to P2025 (Not Found), P2003 (Foreign Key), or P2002 (Unique).
     * @private
     */
    public handlePrismaError(error: any): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new ServerError(errorMessage.NOTFOUND);
            }
            if (error.code === 'P2003') {
                throw new ServerError(errorMessage.INVALIDDATA);
            }
            if (error.code === 'P2002') {
                throw new ServerError(errorMessage.ALREADYTAKEN);
            }
        }
        throw error;
    }

    /**
     * Swaps the current database model with a transaction-scoped client.
     * @param txModel - The Prisma transaction delegate.
     * @returns A new instance of the repository bound to the transaction.
     */
    tx(txModel: any): this {
        const instance = Object.create(Object.getPrototypeOf(this));
        Object.assign(instance, this);
        instance.model = txModel;
        return instance;
    }

    /**
     * Creates a new record in the database.
     * @param data - The data required to create the record.
     * @returns {Promise<T>} The created record.
     * @throws {serverError} If a unique constraint or foreign key check fails.
     */
    create = async (data: TCreateData): Promise<T> => {
        try {
            return await this.model.create({
                data,
                select: {
                    id: true,
                    ...(this.config.hasCreatedAt !== false ? { createdAt: true } : {}),
                }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    /**
     * Retrieves a single record by its primary key.
     * @param id - The unique identifier of the record.
     * @param userId - Optional owner ID to restrict the fetch.
     * @returns {Promise<T>} The found record or an empty object cast as T.
     */
    fetch = async (id: string, userId?: string): Promise<T> => {

        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where
        });
        return record ?? ({} as T);
    };

    /**
     * Fetches multiple records based on pagination, filters, and search criteria.
     * @param data - Pagination and sorting metadata.
     * @param filters - Key-value pairs for where-clause filtering.
     * @param searchFields - List of model fields to apply search logic to.
     * @returns {Promise<T[]>} An array of retrieved records.
     */
    fetchAll = async (
        data: PaginationData,
        filters: any,
        searchFields: string[] = []
    ): Promise<T[]> => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields, this.config.hasCreatedAt);

        return await this.model.findMany({
            take: 10,
            where,
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: "desc" as const }]
                    : []),
                { id: "desc" as const },
            ],
        });
    };
    /**
     * Updates an existing record.
     * @param data - The fields to update.
     * @param id - The unique identifier of the record to update.
     * @returns {Promise<T>} The updated record.
     * @throws {serverError} If the record is not found or validation fails.
     */
    update = async (data: TUpdateData, id: string, userId?: string) => {
        try {
            const where: any = {
                [this.config.primaryKey]: id,
                ...(userId ? { userId } : {})
            };

            if (this.config.statusField) {
                where[this.config.statusField] = null;
            }

            await this.model.update({
                where,
                data,
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };


    /**
     * Performs a logical delete by setting a timestamp on the status/deletedAt field.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The record with the updated deletion timestamp.
     * @throws {serverError} If the record is already deleted or doesn't exist.
     */
    softDelete = async (id: string, userId?: string): Promise<T> => {
        try {
            return await this.model.update({
                where: {
                    [this.config.primaryKey]: id,
                    ...(this.config.statusField ? { [this.config.statusField]: null } : {}),
                    ...(userId ? { userId } : {})
                },
                data: { [this.config.statusField || 'deletedAt']: new Date() }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };

    /**
     * Permanently removes a record from the database.
     * @param id - The unique identifier of the record.
     * @returns {Promise<T>} The deleted record metadata.
     * @throws {serverError} If the record does not exist.
     */
    hardDelete = async (id: string, userId?: string) => {
        try {
            await this.model.delete({
                where: { [this.config.primaryKey]: id, ...(userId ? { userId } : {}) }
            });
        } catch (error) {
            this.handlePrismaError(error);
        }
    };
}
