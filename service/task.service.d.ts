import type { Task, TaskData } from "../dto/tasks.dto.js";
import type { TaskRepository } from "../repository/task.repository.js";
import { BaseService } from "./base.service.js";
declare class TaskService extends BaseService<Task, TaskData, any> {
    constructor(methods: TaskRepository);
}
export { TaskService };
//# sourceMappingURL=task.service.d.ts.map