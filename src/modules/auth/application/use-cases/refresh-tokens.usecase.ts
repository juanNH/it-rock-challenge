import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RefreshDto } from '../dto/refresh.dto';
import { TokensDto } from '../dto/tokens.dto';
import * as tokenServicePort from '../../domain/services/token.service.port';
import * as refreshStorePort from '../../domain/services/refresh-store.port';
import * as userRepositortyPort from 'src/modules/users/domain/repositories/user.repositorty.port';

@Injectable()
export class RefreshTokensUseCase {
  private readonly accessTtl = 15 * 60;
  private readonly refreshTtl = 7 * 24 * 60 * 60;

  constructor(
    @Inject(tokenServicePort.TOKEN_SERVICE)   private readonly tokens: tokenServicePort.ITokenService,
    @Inject(refreshStorePort.REFRESH_STORE)   private readonly refreshStore: refreshStorePort.IRefreshStore,
    @Inject(userRepositortyPort.USER_REPOSITORY) private readonly users: userRepositortyPort.IUserRepository,
  ) {}

  async execute(dto: RefreshDto): Promise<TokensDto> {
    let decoded: { sub: string; jti: string };
    try {
      decoded = await this.tokens.verifyRefresh<{ sub: string; jti: string }>(dto.refresh_token);
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    const userId = await this.refreshStore.get(decoded.jti);
    if (!userId || userId !== decoded.sub) throw new UnauthorizedException('Refresh revocado');

    await this.refreshStore.revoke(decoded.jti); // rotación

    const user = await this.users.findById(decoded.sub);
    if (!user) throw new UnauthorizedException('Usuario inválido');

    const newJti = randomUUID();

    const access_token = await this.tokens.signAccess(
      { sub: user.id, username: user.username, role: (user as any).role?.name ?? 'user' },
      this.accessTtl,
    );

    const refresh_token = await this.tokens.signRefresh({ sub: user.id, jti: newJti }, this.refreshTtl);
    await this.refreshStore.save(newJti, user.id, this.refreshTtl);

    return {
      token_type: 'Bearer',
      access_token,
      refresh_token,
      expires_in: this.accessTtl,
      refresh_expires_in: this.refreshTtl,
    };
  }
}
