import { BaseRepository } from "./base.repository.js";
import type { PaginationData } from "../dto/pagination.dto.js";
declare class ProductRepository extends BaseRepository<any, any, any> {
    constructor();
    create: (data: any) => Promise<any>;
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
    update: (data: any, id: string) => Promise<any>;
}
export { ProductRepository };
//# sourceMappingURL=product.repository.d.ts.map