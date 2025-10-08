import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from '../../users/infrastructure/users.module';

import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './security/jwt.strategy';
import { JwtAuthGuard } from './security/jwt-auth.guard';
import { RolesGuard } from './security/roles.guard';

import { PASSWORD_HASHER } from '../domain/services/password-hasher.port';
import { TOKEN_SERVICE }   from '../domain/services/token.service.port';
import { REFRESH_STORE }   from '../domain/services/refresh-store.port';

import { BcryptHasherAdapter } from './adapters/bcrypt-hasher.adapter';
import { JwtTokenAdapter } from './adapters/jwt-token.adapter';
import { RedisRefreshStoreAdapter } from './adapters/redis-refresh-store.adapter';

import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RefreshTokensUseCase } from '../application/use-cases/refresh-tokens.usecase';
import { LogoutUseCase } from '../application/use-cases/logout.usecase';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-secret',
      // El UC define TTL por llamada (15m/7d), aquí puede quedar default general
      signOptions: { expiresIn: '1h' },
    }),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 5 }]),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    { provide: PASSWORD_HASHER, useClass: BcryptHasherAdapter },
    { provide: TOKEN_SERVICE,   useClass: JwtTokenAdapter },
    { provide: REFRESH_STORE,   useClass: RedisRefreshStoreAdapter },
    LoginUseCase,
    RefreshTokensUseCase,
    LogoutUseCase,
  ],
  exports: [], // normalmente nada; guards/strategy quedan internos
})
export class AuthModule {}
