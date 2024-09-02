/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-30 10:54:03
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-02 09:42:32
 * @Description:
 */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/decorator';
import { CreateOneToOneDto } from './dto/create-one-to-one.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { QueryRoomListDto } from './dto/query-room-list.dto';
import { QueryRoomUsers } from './dto/query-room-users.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  // 创建单聊
  @RequireLogin()
  @Post('createOneToOne')
  async createOneToOne(
    @Body() data: CreateOneToOneDto,
    @UserInfo('uid') uid: number,
  ) {
    return await this.chatroomService.createOneToOne(data, uid);
  }

  // 创建群聊
  @RequireLogin()
  @Post('createGroup')
  async createGroupChatroom(
    @Body() data: CreateGroupDto,
    @UserInfo('uid') uid: number,
  ) {
    return await this.chatroomService.createGroupChatroom(data.roomName, uid);
  }

  // 获取群聊列表
  @RequireLogin()
  @Post('getRoomList')
  async getRoomList(@Body() data: QueryRoomListDto, @UserInfo('uid') uid) {
    return await this.chatroomService.getRoomList(data, uid);
  }

  // 获取群聊的用户
  @RequireLogin()
  @Post('getUsersByChatroomId')
  async getUsersByChatroomId(@Body() data: QueryRoomUsers) {
    return await this.chatroomService.getUsersByChatroomId(data.roomId);
  }

  // 获取聊天室信息
  @RequireLogin()
  @Get('getRoomInfo/:roomId')
  async getRoomInfo(@Param('roomId') roomId: number) {
    if (!roomId) {
      throw new BadRequestException('roomId不能为空');
    }
    return await this.chatroomService.getChatroomInfo(roomId);
  }

  // 加入群聊
  @RequireLogin()
  @Post('join')
  async join(@Body('roomId') roomId: number, @UserInfo('uid') uid: number) {
    if (!roomId) {
      throw new BadRequestException('roomId不能为空');
    }
    return await this.chatroomService.joinChatroom(roomId, uid);
  }

  // 退出群聊
  @RequireLogin()
  @Post('quit')
  async quit(@Body('roomId') roomId: number, @UserInfo('uid') uid: number) {
    if (!roomId) {
      throw new BadRequestException('roomId不能为空');
    }
    return await this.chatroomService.quitChatroom(roomId, uid);
  }
}
