import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

import * as taskRepositoryPort from '../../domain/repositories/task.repository.port';
import { Task } from '../../domain/entities/task';
import { tasksCacheVersionKey } from '../cache/task-cache.util';
import { Env } from '../../../../config/env.config';
import { ExternalDataSource } from '../../domain/enums/data-source.enum';

type ExternalTodo = { userId: number; id: number; title: string; completed: boolean };

@Injectable()
export class PopulateTasksUseCase {
  private readonly dataSource = ExternalDataSource.JsonPlaceholder;
  private readonly env = Env();

  constructor(
    private readonly http: HttpService,
    @Inject(taskRepositoryPort.TASK_REPOSITORY)
    private readonly repo: taskRepositoryPort.ITaskRepository,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private async bumpVersion(userId: string) {
    const anyCache: any = this.cache as any;
    if (anyCache?.store?.client?.incr) await anyCache.store.client.incr(tasksCacheVersionKey(userId));
    else await this.cache.set(tasksCacheVersionKey(userId), Date.now().toString());
  }

  async execute(userId: string, limit = 20) {
    const url = this.env.EXTERNAL.JSONPLACEHOLDER_BASE_URL;

    const { data } = await lastValueFrom(this.http.get<ExternalTodo[]>(url+'/todos'));
    const slice = data.slice(0, limit);

    const extIds = slice.map(t => String(t.id));

    const existing = new Set(
      await this.repo.findExistingExternalIdsByUser(userId, this.dataSource, extIds)
    );
    const toInsert = slice
      .filter(t => !existing.has(String(t.id)))
      .map(t => new Task(
        randomUUID(),
        t.title,
        '',
        !!t.completed,
        'low',
        userId,
        undefined, undefined,
        this.dataSource,
        String(t.id),
      ));

    const inserted = await this.repo.bulkCreate(toInsert);
    if (inserted > 0) await this.bumpVersion(userId);

    return { received: slice.length, skipped: slice.length - inserted, inserted };
  }
}
