import type { Order, OrderData } from "../dto/order.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class OrderRepository extends BaseRepository<Order, OrderData, any> {
    constructor();
    /**
 * Retrieves a single record by its primary key.
 * @param id - The unique identifier of the record.
 * @param userId - Optional owner ID to restrict the fetch.
 * @returns {Promise<T>} The found record or an empty object cast as T.
 */
    fetch: (id: string, userId?: string) => Promise<any>;
    /**
     * Fetches multiple records based on pagination, filters, and search criteria.
     * @param data - Pagination and sorting metadata.
     * @param filters - Key-value pairs for where-clause filtering.
     * @param searchFields - List of model fields to apply search logic to.
     * @returns {Promise<T[]>} An array of retrieved records.
     */
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { OrderRepository };
//# sourceMappingURL=order.repository.d.ts.map