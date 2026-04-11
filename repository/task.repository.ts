import { prisma } from "../db/prisma.js";
import type { Task, TaskData } from "../dto/tasks.dto.js";
import { BaseRepository } from "./base.repository.js";

class TaskRepository extends BaseRepository<Task, TaskData, any> {
    constructor() {
        super(prisma.tasks, "TASK");
    }
}

export { TaskRepository }