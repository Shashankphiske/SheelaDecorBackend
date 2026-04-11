import { errorMessage } from "../constants/error.constants.js";
import type { CustomProductsData } from "../dto/customProducts.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import type { Project, ProjectData } from "../dto/project.dto.js";
import type { ProjectProductData } from "../dto/projectProduct.dto.js";
import { redisUtils } from "../factory/utils.factory.js";
import type { ProjectRepository } from "../repository/project.repository.js";
import { ServerError } from "../utils/error.utils.js";
import { logger } from "../utils/logger.util.js";
import { BaseService } from "./base.service.js";

class ProjectService{ 

    constructor( private method: ProjectRepository ) {} 

    create = async (projectData: ProjectData, projectProductsData: any, customProductsData: any): Promise<any> => {
        const project = await this.method.create(projectData, projectProductsData, customProductsData);

        return project;
    }

    fetch = async (id: string) => {
        const project = await this.method.fetch(id);

        return project;
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

        const records = await this.method.fetchAll(data, filters, searchFields);

        if (records.length == 0) {
            logger.warn(`No Project records found`);

            throw new ServerError(errorMessage.NOTFOUND);
        }

        const lastRecord = records[records.length - 1] as any;

        logger.info(`Project records fetched`);

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
    update = async (data: any, id: string, userId?: string) => {
        const record = await this.method.update(data, id);

        logger.info(`Project record updated`, {
            id
        });

        redisUtils.invalidateKey("PUBLIC", "PROJECT", "UPDATE");

        return record;
    }

    /**
     * Orchestrates record deletion (Soft or Hard) and clears cache.
     * 
     * @param id - The unique identifier of the record.
     * @param flag - Boolean toggle: true for hard delete, false for soft delete.
     * @returns {Promise<T>} The deleted/deactivated record metadata.
     */
    delete = async (id: string) => {
        const record = await this.method.delete(id);
        logger.info(`Project record hard deleted`, { id });

        redisUtils.invalidateKey("PUBLIC", "PROJECT", "DELETE");

        return record;
    }

}

export { ProjectService }