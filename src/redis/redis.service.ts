/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 10:34:21
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 10:45:19
 * @Description: redis
 */
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
