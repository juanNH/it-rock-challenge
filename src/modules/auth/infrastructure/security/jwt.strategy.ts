import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
       secretOrKey: cfg.get<string>('JWT_SECRET', 'dev-secret')
    });
  }
  validate(payload: { sub: string; username: string; role: string }) {
    console.log('[JWT validate] payload:', payload);
    return payload;
  }
}
