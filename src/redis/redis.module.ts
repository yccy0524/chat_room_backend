/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 10:33:37
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 11:20:31
 * @Description:
 */
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          database: 2,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
