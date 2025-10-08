import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../domain/services/token.service.port';

@Injectable()
export class JwtTokenAdapter implements ITokenService {
  constructor(private readonly jwt: JwtService) {}

  signAccess(payload: any, ttlSeconds: number) {
    return this.jwt.signAsync(payload, { expiresIn: `${ttlSeconds}s` });
  }
  signRefresh(payload: any, ttlSeconds: number) {
    return this.jwt.signAsync(payload, { expiresIn: `${ttlSeconds}s` });
  }
  verifyRefresh<T extends object>(token: string) {
    return this.jwt.verifyAsync<T>(token);
  }
}
