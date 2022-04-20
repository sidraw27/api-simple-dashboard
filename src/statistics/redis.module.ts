import { Module } from '@nestjs/common';
import { RedisModule as CoreModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CoreModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const url = configService.get('REDIS_URL');
        const port = configService.get('REDIS_PORT');

        return {
          config: {
            url: `redis://${url}:${port}`,
          },
        };
      },
    }),
  ],
})
export class RedisModule {}
