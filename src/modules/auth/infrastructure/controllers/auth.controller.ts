import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiTooManyRequestsResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from '../../application/dto/login.dto';
import { RefreshDto } from '../../application/dto/refresh.dto';
import { TokensDto } from '../../application/dto/tokens.dto';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RefreshTokensUseCase } from '../../application/use-cases/refresh-tokens.usecase';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly refreshUC: RefreshTokensUseCase,
    private readonly jwt: JwtService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login con username/password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokensDto })
  @ApiTooManyRequestsResponse({ description: 'More than 5 request y less than 1 min.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) { return this.loginUC.execute(dto); }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresca tokens (rotación de refresh incluida)' })
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ type: TokensDto })
  refresh(@Body() dto: RefreshDto) { return this.refreshUC.execute(dto); }

  @Get('token-info')
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Token invalido' })
  @ApiOperation({ summary: 'Devuelve el payload del access token' })
  tokenInfo(@Req() req: any) { return req.user; }

}

