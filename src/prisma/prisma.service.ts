/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 09:13:19
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 09:19:10
 * @Description:
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
