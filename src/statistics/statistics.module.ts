import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [RedisModule],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
