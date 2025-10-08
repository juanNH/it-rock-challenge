import { UserOrmEntity } from "../../infrastructure/persistence/typeorm/user.orm-entity";

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository {
  findByUsername(username: string): Promise<UserOrmEntity | null>;
  findById(id: string): Promise<UserOrmEntity | null>;
}
