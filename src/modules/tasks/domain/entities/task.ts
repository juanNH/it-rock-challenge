export type TaskPriority = 'low' | 'medium' | 'high';

export class Task {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public priority: TaskPriority,
    public userId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
