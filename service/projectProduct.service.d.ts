import type { ProjectLabour, ProjectLabourData } from "../dto/projectLabour.dto.js";
import type { ProjectProductRepository } from "../repository/projectProduct.repository.js";
import { BaseService } from "./base.service.js";
declare class ProjectProductService extends BaseService<ProjectLabour, ProjectLabourData, any> {
    constructor(methods: ProjectProductRepository);
}
export { ProjectProductService };
//# sourceMappingURL=projectProduct.service.d.ts.map