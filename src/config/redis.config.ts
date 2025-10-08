import { Env } from './env.config';
import { redisStore } from 'cache-manager-redis-yet';
import type { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const RedisCacheConfig = (): CacheModuleAsyncOptions => {
  const env = Env();
  return {
    isGlobal: true,
    useFactory: async () => ({
      store: await redisStore({
        socket: {
          host: env.REDIS.HOST,
          port: env.REDIS.PORT,
          // @ts-ignore (prop soportada por ioredis)
          password: process.env.REDIS_PASSWORD || undefined,
        },
        ttl: env.REDIS.TTL_MS ?? 60000, // ms
      }),
    }),
  };
};
