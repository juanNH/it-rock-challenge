// src/common/common.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
  imports: [ConfigModule],
  providers: [ApiKeyGuard],
  exports: [ApiKeyGuard],
})
export class CommonModule {}
