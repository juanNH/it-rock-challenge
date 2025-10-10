import { Task, TaskPriority } from '../entities/task';
import { ExternalDataSource } from '../enums/data-source.enum';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface ITaskRepository {
  create(t: Task): Promise<Task>;
  update(t: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  listByUser(
    userId: string,
    opts: { page: number; pageSize: number; priority?: TaskPriority; completed?: boolean }
  ): Promise<{ data: Task[]; total: number }>;
  findExistingExternalIdsByUser(userId: string, source: ExternalDataSource, ids: string[]): Promise<string[]>;
  bulkCreate(tasks: Task[]): Promise<number>;
}
