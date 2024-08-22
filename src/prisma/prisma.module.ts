/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 09:10:59
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 09:22:53
 * @Description: prisma module
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
