import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { TokensDto } from '../dto/tokens.dto';
import * as passwordHasherPort from '../../domain/services/password-hasher.port';
import * as tokenServicePort from '../../domain/services/token.service.port';
import * as refreshStorePort from '../../domain/services/refresh-store.port';
import * as userRepositortyPort from 'src/modules/users/domain/repositories/user.repositorty.port';

@Injectable()
export class LoginUseCase {
  private readonly accessTtl = 15 * 60;            // 15 min
  private readonly refreshTtl = 7 * 24 * 60 * 60;  // 7 días

  constructor(
    @Inject(userRepositortyPort.USER_REPOSITORY) private readonly users: userRepositortyPort.IUserRepository,
    @Inject(passwordHasherPort.PASSWORD_HASHER) private readonly hasher: passwordHasherPort.IPasswordHasher,
    @Inject(tokenServicePort.TOKEN_SERVICE)   private readonly tokens: tokenServicePort.ITokenService,
    @Inject(refreshStorePort.REFRESH_STORE)   private readonly refreshStore: refreshStorePort.IRefreshStore,
  ) {}

  async execute(dto: LoginDto): Promise<TokensDto> {
    const user = await this.users.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await this.hasher.compare(dto.password, (user as any).passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const jti = randomUUID();

    const access_token = await this.tokens.signAccess(
      { sub: user.id, username: user.username, role: (user as any).role?.name ?? 'user' },
      this.accessTtl,
    );

    const refresh_token = await this.tokens.signRefresh(
      { sub: user.id, jti },
      this.refreshTtl,
    );

    await this.refreshStore.save(jti, user.id, this.refreshTtl);
    // (opcional) user.registerSuccessfulLogin(); await this.users.update(user);

    return {
      token_type: 'Bearer',
      access_token,
      refresh_token,
      expires_in: this.accessTtl,
      refresh_expires_in: this.refreshTtl,
    };
  }
}
