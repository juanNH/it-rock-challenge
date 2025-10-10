export const TASK_CREATED = 'tasks.created';
export const TASK_COMPLETED = 'tasks.completed';

export interface TaskCreatedEvent {
  taskId: string;
  userId: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface TaskCompletedEvent {
  taskId: string;
  userId: string;
  completedAt: Date;
}
