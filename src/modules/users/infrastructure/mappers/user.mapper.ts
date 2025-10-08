import { User } from '../../domain/entities/user';
import { UserOrmEntity } from '../persistence/typeorm/user.orm-entity';

export class UserMapper {
  static toDomain(raw: UserOrmEntity): User {
    return new User(
      raw.id,
      raw.username,
      raw.roleId,
      raw.lastLoginAt,
      raw.lockedUntil,
      raw.failedLoginAttempts,
    );
  }

  static toOrm(u: User): UserOrmEntity {
    const e = new UserOrmEntity();
    e.id = u.id;
    e.username = u.username;
    // e.passwordHash se setea fuera del dominio (Auth), no acá
    e.roleId = u.roleId;
    e.lastLoginAt = u.lastLoginAt ?? null;
    e.lockedUntil = u.lockedUntil ?? null;
    e.failedLoginAttempts = u.failedLoginAttempts;
    return e;
  }
}
