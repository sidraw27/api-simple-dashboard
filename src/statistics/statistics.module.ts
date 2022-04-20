import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { StatisticsService } from './statistics.service';
import { UserModule } from '../app/user';

@Module({
  imports: [RedisModule, forwardRef(() => UserModule)],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
