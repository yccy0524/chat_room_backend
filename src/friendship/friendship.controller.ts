/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:28:58
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-26 11:23:24
 * @Description:
 */
import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
