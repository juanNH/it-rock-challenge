import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PopulateQueryDto {
  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 2000 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(2000)
  limit?: number = 20;
}
