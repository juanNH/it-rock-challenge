import { Task, TaskPriority } from '../entities/task';

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');

export interface ITaskRepository {
  create(t: Task): Promise<Task>;
  update(t: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  /** Lista con filtros y paginación solo del owner */
  listByUser(
    userId: string,
    opts: { page: number; pageSize: number; priority?: TaskPriority; completed?: boolean }
  ): Promise<{ data: Task[]; total: number }>;
}
