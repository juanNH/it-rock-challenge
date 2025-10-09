import { Task } from '../../domain/entities/task';
import { TaskOrmEntity } from '../persistence/typeorm/task.orm-entity';

export class TaskMapper {
  static toDomain(e: TaskOrmEntity): Task {
    return new Task(e.id, e.title, e.description, e.completed, e.priority, e.userId, e.createdAt, e.updatedAt);
  }
  static toOrm(t: Task): TaskOrmEntity {
    const e = new TaskOrmEntity();
    e.id = t.id; e.title = t.title; e.description = t.description; e.completed = t.completed;
    e.priority = t.priority; e.userId = t.userId; (e as any).createdAt = t.createdAt; (e as any).updatedAt = t.updatedAt;
    return e;
  }
}
