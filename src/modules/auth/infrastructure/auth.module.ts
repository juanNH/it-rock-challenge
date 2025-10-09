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
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET', 'dev-secret'),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 5 }]),
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
  ],
  exports: [],
})
export class AuthModule {}
