import type { PaginationData } from "../dto/pagination.dto.js";
import type { ProjectLabour, ProjectLabourData } from "../dto/projectLabour.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class ProjectLabourRepository extends BaseRepository<ProjectLabour, ProjectLabourData, any> {
    constructor();
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { ProjectLabourRepository };
//# sourceMappingURL=projectLabour.repository.d.ts.map