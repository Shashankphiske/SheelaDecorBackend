import type { ProjectLabour, ProjectLabourData } from "../dto/projectLabour.dto.js";
import type { ProjectLabourRepository } from "../repository/projectLabour.repository.js";
import { BaseService } from "./base.service.js";
declare class ProjectLabourService extends BaseService<ProjectLabour, ProjectLabourData, any> {
    constructor(methods: ProjectLabourRepository);
}
export { ProjectLabourService };
//# sourceMappingURL=projectLabour.service.d.ts.map