import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { LoginDto } from '../../application/dto/login.dto';
import { RefreshDto } from '../../application/dto/refresh.dto';
import { TokensDto } from '../../application/dto/tokens.dto';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { RefreshTokensUseCase } from '../../application/use-cases/refresh-tokens.usecase';
import { LogoutUseCase } from '../../application/use-cases/logout.usecase';
import { JwtAuthGuard } from '../security/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly refreshUC: RefreshTokensUseCase,
    private readonly logoutUC: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: {limit: 5, ttl: 60} })
  @ApiOperation({ summary: 'Login con username/password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokensDto })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) { return this.loginUC.execute(dto); }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresca tokens (rotación de refresh incluida)' })
  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ type: TokensDto })
  refresh(@Body() dto: RefreshDto) { return this.refreshUC.execute(dto); }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoca el refresh token actual' })
  @ApiBody({ type: RefreshDto })
  logout(@Body() dto: RefreshDto) { return this.logoutUC.execute(dto); }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Devuelve el payload del access token' })
  me(@Req() req: any) { return req.user; }
}
