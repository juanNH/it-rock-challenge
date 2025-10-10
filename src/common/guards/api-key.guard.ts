import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const apiKey = req.headers['x-api-key'] as string | undefined;
    if (!apiKey) throw new UnauthorizedException('x-api-key header is required');
    if (apiKey !== process.env.TASKS_POPULATE_API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
