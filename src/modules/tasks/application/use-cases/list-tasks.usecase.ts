import { Inject, Injectable } from '@nestjs/common';
import * as cacheManager from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { QueryTaskDto } from '../dto/query-task.dto';
import { tasksCacheKey, tasksCacheVersionKey } from '../cache/task-cache.util';

@Injectable()
export class ListTasksUseCase {
  private readonly ttlMs = 10 * 60 * 1000; // 10 min

  constructor(
    @Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: cacheManager.Cache,
  ) {}

  private async getVersion(userId: string): Promise<string> {
    const v = (await this.cache.get<string>(tasksCacheVersionKey(userId))) ?? '0';
    return v;
  }

  async execute(userId: string, q: QueryTaskDto) {
    const completed = q.completed !== undefined ? q.completed === 'true' : undefined;
    const version = await this.getVersion(userId);
    const key = tasksCacheKey(userId, version, { ...q, completed });

    const cached = await this.cache.get<any>(key);
    if (cached) return cached;

    const { data, total } = await this.repo.listByUser(userId, {
      page: q.page,
      pageSize: q.pageSize,
      priority: q.priority as any,
      completed,
    });

    const payload = {
      data,
      meta: {
        page: q.page,
        pageSize: q.pageSize,
        total,
        totalPages: Math.ceil(total / q.pageSize),
      },
    };

    await this.cache.set(key, payload, this.ttlMs);
    return payload;
  }
}
