import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './core/infrastructure/typeorm/typeorm.config';
import { RedisCacheConfig } from './config/redis.config';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { TasksModule } from './modules/tasks/infrastructure/tasks.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import * as crypto from 'crypto'
import { Env } from './config/env.config';
import { CoreModule } from './core/infrastructure/core.module';
const env = Env()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisCacheConfig()),
    TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-request-id'] as string || crypto.randomUUID(),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'response.headers.set-cookie',
            '*.password',
            'body.password',
          ],
          censor: '[REDACTED]',
        },
        transport: env.NODE_ENV === 'production'
          ? undefined
          : { target: 'pino-pretty', options: { singleLine: true, colorize: true, translateTime: 'SYS:standard' } },
        serializers: {
          req(req) {
            return { id: req.id, method: req.method, url: req.url, params: req.params, query: req.query, remote: req.ip };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },
        level: env.LOG.PINO_LEVEL,
        customLogLevel(req, res, err) {
          if (err || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),

    CoreModule,
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}
