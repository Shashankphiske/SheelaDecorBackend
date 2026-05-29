import type { PaginationData } from "../dto/pagination.dto.js";
import type { Task, TaskData } from "../dto/tasks.dto.js";
import { BaseRepository } from "./base.repository.js";
declare class TaskRepository extends BaseRepository<Task, TaskData, any> {
    constructor();
    create: (data: TaskData) => Promise<Task>;
    fetch: (id: string, userId?: string) => Promise<any>;
    fetchAll: (data: PaginationData, filters: any, searchFields?: string[]) => Promise<any>;
}
export { TaskRepository };
//# sourceMappingURL=task.repository.d.ts.map