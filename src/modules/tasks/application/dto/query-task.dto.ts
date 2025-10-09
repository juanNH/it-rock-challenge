import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTaskDto {
  @ApiPropertyOptional({ default: 1 }) @Type(() => Number) @IsInt() @Min(1) page: number = 1;
  @ApiPropertyOptional({ default: 10 }) @Type(() => Number) @IsInt() @Min(1) pageSize: number = 10;
  @ApiPropertyOptional({ enum: ['low','medium','high'] }) @IsOptional() @IsIn(['low','medium','high']) priority?: 'low'|'medium'|'high';
  @ApiPropertyOptional({ description: 'true|false' }) @IsOptional() @IsBooleanString() completed?: string; // se parsea a boolean luego
}
