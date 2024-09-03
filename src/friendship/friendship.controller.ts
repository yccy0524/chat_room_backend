/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:28:58
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 09:56:48
 * @Description:
 *
 */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/decorator';
import { AddFriendDto } from './dto/add-friend.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @RequireLogin()
  @Post('add')
  async addFriend(@UserInfo('uid') uid: number, @Body() data: AddFriendDto) {
    return await this.friendshipService.add(uid, data);
  }

  @RequireLogin()
  @Get('getFriendRequestList')
  async getFriendRequestList(@UserInfo('uid') uid: number) {
    return await this.friendshipService.getFriendRequestList(uid);
  }

  // 同意添加好友
  @RequireLogin()
  @Get('agree/:uid')
  async agree(@Param('uid') friendId: number, @UserInfo('uid') uid: number) {
    if (!friendId) {
      throw new HttpException('好友id不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.friendshipService.agree(friendId, uid);
  }

  // 拒绝添加好友
  @RequireLogin()
  @Get('reject/:uid')
  async reject(@Param('uid') friendId: number, @UserInfo('uid') uid: number) {
    if (!friendId) {
      throw new HttpException('好友id不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.friendshipService.reject(friendId, uid);
  }

  // 获取朋友列表
  @RequireLogin()
  @Get('list')
  async getFriendShip(
    @UserInfo('uid') uid: number,
    @Query('name') name?: string,
  ) {
    return await this.friendshipService.getFriendShip(uid, name);
  }

  // 删除好友
  @RequireLogin()
  @Get('delete/:uid')
  async deleteFriend(
    @Param('uid') friendId: number,
    @UserInfo('uid') uid: number,
  ) {
    return await this.friendshipService.deleteFriend(friendId, uid);
  }
}
