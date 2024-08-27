import { Inject, Injectable } from '@nestjs/common';
import { AddFriendDto } from './dto/add-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  prisma: PrismaService;

  async add(uid: number, data: AddFriendDto) {
    return await this.prisma.friend_Request.create({
      data: {
        fromUid: uid,
        toUid: data.uid,
        reason: data.reason,
        status: 0,
      },
    });
  }

  // 获取好友申请列表
  async getFriendRequestList(uid: number) {
    return await this.prisma.friend_Request.findMany({
      where: {
        fromUid: uid,
      },
    });
  }

  // 同意添加好友
  async agree(friendId: number, uid: number) {
    await this.prisma.friend_Request.updateMany({
      where: {
        toUid: uid,
        fromUid: friendId,
        status: 0,
      },
      data: {
        status: 1,
      },
    });

    const res = await this.prisma.friendShip.findMany({
      where: {
        friendId,
        uid,
      },
    });
    if (!res.length) {
      await this.prisma.friendShip.create({
        data: {
          uid: uid,
          friendId: friendId,
        },
      });
    }
    return '添加成功';
  }
}
