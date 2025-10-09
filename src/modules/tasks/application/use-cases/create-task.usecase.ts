import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../../domain/entities/task';
import { tasksCacheVersionKey } from '../cache/task-cache.util';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private async bumpVersion(userId: string) {
    const anyCache: any = this.cache as any;
    if (anyCache?.store?.client?.incr) {
      await anyCache.store.client.incr(tasksCacheVersionKey(userId));
    } else {
      // fallback: set timestamp
      await this.cache.set(tasksCacheVersionKey(userId), Date.now().toString());
    }
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
    await this.bumpVersion(userId);
    return saved;
  }
}
