
import type { ProjectLabour, ProjectLabourData } from "../dto/projectLabour.dto.js";
import type { ProjectLabourRepository } from "../repository/projectLabour.repository.js";
import { BaseService } from "./base.service.js";

class ProjectLabourService extends BaseService<ProjectLabour, ProjectLabourData, any> {
    constructor(methods: ProjectLabourRepository) {
        super(methods, "PROJECT-LABOUR");
    }
}

export { ProjectLabourService };