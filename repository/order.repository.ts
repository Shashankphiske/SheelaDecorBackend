import { prisma } from "../db/prisma.js";
import type { Order, OrderData } from "../dto/order.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { serverUtils } from "../utils/server.utils.js";

import { BaseRepository } from "./base.repository.js";

class OrderRepository extends BaseRepository<Order, OrderData, any> {
    constructor() {
        super(prisma.orders, "ORDER", { hasCreatedAt: false });
    }

    /**
 * Retrieves a single record by its primary key.
 * @param id - The unique identifier of the record.
 * @param userId - Optional owner ID to restrict the fetch.
 * @returns {Promise<T>} The found record or an empty object cast as T.
 */
    fetch = async (id: string, userId?: string) => {

        const where: any = {
            [this.config.primaryKey]: id,
            ...(userId ? { userId } : {})
        };

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }
        const record = await this.model.findFirst({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                catalogue: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        return record ?? ({} as Order);
    };

    /**
     * Fetches multiple records based on pagination, filters, and search criteria.
     * @param data - Pagination and sorting metadata.
     * @param filters - Key-value pairs for where-clause filtering.
     * @param searchFields - List of model fields to apply search logic to.
     * @returns {Promise<T[]>} An array of retrieved records.
     */
    fetchAll = async (data: PaginationData, filters: any, searchFields: string[] = []) => {
        let where: any = {};

        if (this.config.statusField) {
            where[this.config.statusField] = null;
        }

        where = serverUtils.buildWhere(where, filters, data, searchFields);

        // ── Cursor pagination ─────────────────────────────────────────────────
        if (data.lastId) {
            if (this.config.hasCreatedAt && data.lastCreatedAt) {
                // Use compound cursor: createdAt + id for stable ordering
                where.OR = [
                    { createdAt: { lt: new Date(data.lastCreatedAt) } },
                    {
                        createdAt: new Date(data.lastCreatedAt),
                        id: { lt: data.lastId }
                    }
                ];
            } else {
                // No createdAt — cursor by id only
                where.id = { lt: data.lastId };
            }
        }

        return await this.model.findMany({
            take: 10,
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                catalogue: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                area: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: [
                ...(this.config.hasCreatedAt !== false
                    ? [{ createdAt: "desc" as const }]
                    : []
                ),
                { id: "desc" as const }
            ]
        });
    };

}

export { OrderRepository };