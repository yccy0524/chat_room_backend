/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:28:58
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 09:43:07
 * @Description:
 */
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

  // 拒绝添加好友
  async reject(friendId: number, uid: number) {
    await this.prisma.friend_Request.updateMany({
      where: {
        toUid: uid,
        fromUid: friendId,
        status: 0,
      },
      data: {
        status: 2,
      },
    });

    return '已拒绝';
  }

  // 获取好友列表
  async getFriendShip(uid: number) {
    const friends = await this.prisma.friendShip.findMany({
      where: {
        OR: [
          {
            uid: uid,
          },
          {
            friendId: uid,
          },
        ],
      },
    });

    const set = new Set<number>();
    friends.forEach((item) => {
      set.add(item.uid);
      set.add(item.friendId);
    });

    const uidList = Array.from([...set]).filter((item) => item !== uid);

    const res = [];
    for (let i = 0; i < uidList.length; i++) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: uidList[i],
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          headePic: true,
          email: true,
        },
      });

      res.push(user);
    }

    return res;
  }

  // 删除好友
  async deleteFriend(friendId: number, uid: number) {
    await this.prisma.friendShip.deleteMany({
      where: {
        uid: uid,
        friendId: friendId,
      },
    });

    return '删除成功';
  }
}
