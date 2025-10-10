// src/modules/tasks/application/use-cases/update-task.usecase.ts
import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { tasksCacheVersionKey } from '../cache/task-cache.util';
import { TASK_COMPLETED, TaskCompletedEvent } from '../../domain/events/task.events';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly events: EventEmitter2,
  ) {}

  private async bumpVersion(userId: string) {
    const anyCache: any = this.cache as any;
    if (anyCache?.store?.client?.incr) {
      await anyCache.store.client.incr(tasksCacheVersionKey(userId));
    } else {
      await this.cache.set(tasksCacheVersionKey(userId), Date.now().toString());
    }
  }

  async execute(userId: string, id: string, role: string | undefined, dto: UpdateTaskDto) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Task not found');
    if (t.userId !== userId && role !== 'admin') throw new ForbiddenException('Not allowed');

    const wasCompleted = t.completed === true;

    if (dto.title !== undefined) t.title = dto.title;
    if (dto.description !== undefined) t.description = dto.description;
    if (dto.priority !== undefined) t.priority = dto.priority;
    if (dto.completed !== undefined) t.completed = dto.completed;

    const updated = await this.repo.update(t);

    if (!wasCompleted && updated.completed === true) {
      const payload: TaskCompletedEvent = {
        taskId: updated.id,
        userId: updated.userId,
        completedAt: updated.updatedAt ?? new Date(),
      };
      this.events.emit(TASK_COMPLETED, payload);
    }

    await this.bumpVersion(t.userId);
    return updated;
  }
}
