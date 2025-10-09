import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Env } from '../../../config/env.config';
import { UserOrmEntity } from '../../../modules/users/infrastructure/persistence/typeorm/user.orm-entity';
import { RoleOrmEntity } from '../../../modules/users/infrastructure/persistence/typeorm/role.orm-entity';
import { TaskOrmEntity } from '../../../modules/tasks/infrastructure/persistence/typeorm/task.orm-entity';

export const typeormConfig = (): TypeOrmModuleOptions => {
  const env = Env();
  return {
    type: 'postgres',
    host: env.DB.HOST,
    port: env.DB.PORT,
    username: env.DB.USER,
    password: env.DB.PASS,
    database: env.DB.NAME,
    entities: [UserOrmEntity, RoleOrmEntity , TaskOrmEntity ],
    synchronize: false,
    migrations: ['dist/migrations/*.js'],
    migrationsTableName: 'typeorm_migrations'
  };
};
