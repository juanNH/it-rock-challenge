import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { IRefreshStore } from '../../domain/services/refresh-store.port';

@Injectable()
export class RedisRefreshStoreAdapter implements IRefreshStore {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async save(jti: string, userId: string, ttlSeconds: number): Promise<void> {
    await this.cache.set(`rt:${jti}`, userId, ttlSeconds);
  }
  async get(jti: string): Promise<string | null> {
    const result = await this.cache.get<string>(`rt:${jti}`);
    return result === undefined ? null : result;
  }
  async revoke(jti: string): Promise<void> {
    await this.cache.del(`rt:${jti}`);
  }
}
