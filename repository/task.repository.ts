import { prisma } from "../db/prisma.js";
import type { Task, TaskData } from "../dto/tasks.dto.js";
import { BaseRepository } from "./base.repository.js";

class TaskRepository extends BaseRepository<Task, TaskData, any> {
    constructor() {
        super(prisma.tasks, "TASK");
    }

    create = async (data: TaskData): Promise<Task> => {
        return await this.model.create({
            data: {
                ...data,
                taskDate: new Date(data.taskDate)
            }
        })
    };
}

export { TaskRepository }