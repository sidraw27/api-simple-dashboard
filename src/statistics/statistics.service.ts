import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { afterDays, getYmdFormatDate } from '../app/util/date/date-helper';
import { UserRepository } from '../app/user/user.repository';

const enum Key {
  userStatistics = 'user_statistics',
  loginTimes = 'record_login_times',
  active = 'active_users_{Ymd}',
}

interface Statistics {
  totalUsers: number;
  todayActiveUsers: number;
  daysAvgActiveUsers: number;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRedis() private redis: Redis,
    private readonly userRepository: UserRepository,
  ) {}

  public async recordLogin(uuid: string) {
    const score = Number(await this.redis.zscore(Key.loginTimes, uuid));

    await this.redis.zadd(Key.loginTimes, score + 1, uuid);
  }

  public async recordActive(uuid: string) {
    const key = Key.active.replace('{Ymd}', getYmdFormatDate());

    await this.redis.zadd(key, new Date().getTime(), uuid);
  }

  public async getUserStatistics(): Promise<Statistics> {
    let statistics: Statistics;

    const jsonStatistics = await this.redis.get(Key.userStatistics);

    if (jsonStatistics !== null) {
      statistics = JSON.parse(jsonStatistics);
    } else {
      const days = 7;
      let daysActiveUsers = 0;
      let activeUsers = 0;
      let todayActiveUsers = 0;
      let dayKey;

      const daysRange = Array.from({ length: days }, (_, i) => i + 1);
      // eslint-disable-next-line no-restricted-syntax,guard-for-in
      for (const day in daysRange) {
        dayKey = Key.active.replace('{Ymd}', getYmdFormatDate(afterDays(-day)));
        // eslint-disable-next-line no-await-in-loop
        activeUsers = Number(await this.redis.zcard(dayKey));
        if (Number(day) === 0) {
          todayActiveUsers = activeUsers;
        }
        daysActiveUsers += activeUsers;
      }

      statistics = {
        totalUsers: await this.userRepository.getTotal(),
        todayActiveUsers,
        daysAvgActiveUsers: Math.ceil(daysActiveUsers / days),
      };

      this.redis.set(Key.userStatistics, JSON.stringify(statistics));
      this.redis.expire(Key.userStatistics, 60);
    }

    return statistics;
  }
}
