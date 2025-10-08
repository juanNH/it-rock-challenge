import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './core/infrastructure/typeorm/typeorm.config';
import { RedisCacheConfig } from './config/redis.config';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';

// Tus módulos de features
/* import { UsersModule } from './modules/users/infrastructure/users.module';
import { AuthModule } from './modules/auth/infrastructure/auth.module';
import { TasksModule } from './modules/tasks/infrastructure/tasks.module';
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisCacheConfig()),
    TypeOrmModule.forRootAsync({ useFactory: typeormConfig }),

    UsersModule,
    AuthModule,
    /*TasksModule, */
  ],
})
export class AppModule {}
