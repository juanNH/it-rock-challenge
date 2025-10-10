import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Env } from '../../config/env.config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => {
        const env = Env();
        return {
          timeout: env.EXTERNAL.TIMEOUT_MS,
          maxRedirects: 0,
        };
      },
    }),
  ],
  exports: [HttpModule],
})
export class CoreModule {}
