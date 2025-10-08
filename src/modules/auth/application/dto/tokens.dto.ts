import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @ApiProperty({ example: 'Bearer' }) token_type!: 'Bearer';
  @ApiProperty({ description: 'Access token (15 min)' }) access_token!: string;
  @ApiProperty({ description: 'Refresh token (7 días)' }) refresh_token!: string;
  @ApiProperty({ example: 900, description: 'Expira en segundos (access)' }) expires_in!: number;
  @ApiProperty({ example: 604800, description: 'Expira en segundos (refresh)' }) refresh_expires_in!: number;
}
