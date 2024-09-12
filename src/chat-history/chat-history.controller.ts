import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { HistoryDto } from './dto/history.dto';
import { RequireLogin, UserInfo } from 'src/decorator';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  // 聊天记录
  @RequireLogin()
  @Post('list')
  async getChatroomHistory(@Body('chatroomId') chatroomId: number) {
    if (!chatroomId) {
      throw new BadRequestException('chatroomId 不能为空');
    }
    return await this.chatHistoryService.list(chatroomId);
  }

  // 添加聊天记录
  @RequireLogin()
  @Post('add')
  async addHistory(@Body() data: HistoryDto, @UserInfo('uid') uid: number) {
    return await this.chatHistoryService.add(data, uid);
  }
}
