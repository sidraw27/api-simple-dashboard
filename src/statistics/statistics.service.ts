import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { getYmdFormatDate } from '../app/util/date/date-helper';

const enum Key {
  loginTimes = 'record_login_times',
  active = 'active_users_{Ymd}',
}

@Injectable()
export class StatisticsService {
  constructor(@InjectRedis() private redis: Redis) {}

  public async recordLogin(uuid: string) {
    const score = Number(await this.redis.zscore(Key.loginTimes, uuid));

    await this.redis.zadd(Key.loginTimes, score + 1, uuid);
  }

  public async recordActive(uuid: string) {
    const key = Key.active.replace('{Ymd}', getYmdFormatDate());

    await this.redis.zadd(key, new Date().getTime(), uuid);
  }
}
