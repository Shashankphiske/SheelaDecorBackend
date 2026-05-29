import type { Catalogue, CatalogueData } from "../dto/catalogues.dto.js";
import type { PaginationData } from "../dto/pagination.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class CatalogueRepository extends BaseRepository<Catalogue, CatalogueData, any> {
    constructor();
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { CatalogueRepository };
//# sourceMappingURL=catalogue.repository.d.ts.map