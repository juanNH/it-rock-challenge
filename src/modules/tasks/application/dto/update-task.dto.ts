import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(1, 150) title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @ApiPropertyOptional({ enum: ['low','medium','high'] }) @IsOptional() @IsIn(['low','medium','high']) priority?: 'low'|'medium'|'high';
  @ApiPropertyOptional() @IsOptional() @IsBoolean() completed?: boolean;
}
