/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-03 17:33:20
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-07 13:45:43
 * @Description:
 */
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatHistoryModule } from 'src/chat-history/chat-history.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [ChatHistoryModule],
})
export class ChatModule {}
