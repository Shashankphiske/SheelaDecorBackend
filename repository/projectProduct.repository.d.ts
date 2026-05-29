import type { PaginationData } from "../dto/pagination.dto.js";
import type { ProjectProduct, ProjectProductData } from "../dto/projectProduct.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class ProjectProductRepository extends BaseRepository<ProjectProduct, ProjectProductData, any> {
    constructor();
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { ProjectProductRepository };
//# sourceMappingURL=projectProduct.repository.d.ts.map