/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-04 09:44:39
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-07 13:40:00
 * @Description:
 */
import { Module } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';

@Module({
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
  exports: [ChatHistoryService],
})
export class ChatHistoryModule {}
