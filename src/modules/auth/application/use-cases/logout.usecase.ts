import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshDto } from '../dto/refresh.dto';
import * as tokenServicePort from '../../domain/services/token.service.port';
import * as refreshStorePort from '../../domain/services/refresh-store.port';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(tokenServicePort.TOKEN_SERVICE) private readonly tokens: tokenServicePort.ITokenService,
    @Inject(refreshStorePort.REFRESH_STORE) private readonly refreshStore: refreshStorePort.IRefreshStore,
  ) {}

  async execute(dto: RefreshDto): Promise<{ revoked: boolean }> {
    try {
      const decoded = await this.tokens.verifyRefresh<{ sub: string; jti: string }>(dto.refresh_token);
      await this.refreshStore.revoke(decoded.jti);
      return { revoked: true };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }
}
