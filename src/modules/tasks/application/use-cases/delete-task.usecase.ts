import { Inject, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { tasksCacheVersionKey } from '../cache/task-cache.util';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(taskRepositoryPort.TASK_REPOSITORY) private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private async bumpVersion(userId: string) {
    const anyCache: any = this.cache as any;
    if (anyCache?.store?.client?.incr) {
      await anyCache.store.client.incr(tasksCacheVersionKey(userId));
    } else {
      await this.cache.set(tasksCacheVersionKey(userId), Date.now().toString());
    }
  }

  async execute(requestUserId: string, id: string, role?: string) {
    const t = await this.repo.findById(id);
    if (!t) throw new NotFoundException('Task not found');
    if (t.userId !== requestUserId && role !== 'admin') throw new ForbiddenException('Not allowed');
    await this.repo.delete(id);
    await this.bumpVersion(t.userId);
    return { deleted: true };
  }
}
