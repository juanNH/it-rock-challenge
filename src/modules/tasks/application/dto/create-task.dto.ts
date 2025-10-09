import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty() @IsString() @Length(1, 150) title!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @Length(0, 2000) description?: string;
  @ApiProperty({ enum: ['low','medium','high'] }) @IsIn(['low','medium','high']) priority!: 'low' | 'medium' | 'high';
  @ApiProperty({ required: false, default: false }) @IsOptional() @IsBoolean() completed?: boolean;
}
