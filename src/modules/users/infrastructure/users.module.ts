import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeormRepository } from './persistence/typeorm/user.typeorm.repository';
import { UserOrmEntity } from './persistence/typeorm/user.orm-entity';
import { RoleOrmEntity } from './persistence/typeorm/role.orm-entity';
import { USER_REPOSITORY } from '../domain/repositories/user.repositorty.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])],
  providers: [{ provide: USER_REPOSITORY, useClass: UserTypeormRepository }],
  exports: [{ provide: USER_REPOSITORY, useClass: UserTypeormRepository }],
})
export class UsersModule {}
