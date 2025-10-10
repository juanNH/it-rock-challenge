// src/modules/tasks/application/use-cases/create-task.usecase.ts
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../../domain/entities/task';
import { tasksCacheVersionKey } from '../cache/task-cache.util';
import { TASK_CREATED, TaskCreatedEvent } from '../../domain/events/task.events';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly events: EventEmitter2,
  ) {}

  private async bumpVersion(userId: string) {
    const anyCache: any = this.cache as any;
    if (anyCache?.store?.client?.incr) await anyCache.store.client.incr(tasksCacheVersionKey(userId));
    else await this.cache.set(tasksCacheVersionKey(userId), Date.now().toString());
  }

  async execute(userId: string, dto: CreateTaskDto) {
    const task = new Task(
      randomUUID(),
      dto.title,
      dto.description ?? '',
      dto.completed ?? false,
      dto.priority,
      userId,
    );

    const saved = await this.repo.create(task);

    const payload: TaskCreatedEvent = {
      taskId: saved.id,
      userId: saved.userId,
      title: saved.title,
      priority: saved.priority,
      createdAt: saved.createdAt ?? new Date(),
    };
    this.events.emit(TASK_CREATED, payload);

    await this.bumpVersion(userId);
    return saved;
  }
}
