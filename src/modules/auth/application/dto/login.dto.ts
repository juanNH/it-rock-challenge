import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'juan' }) @IsString() username!: string;
  @ApiProperty({ example: 'password_de_juan' }) @IsString() password!: string;
}
