/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:28:58
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-03 17:05:06
 * @Description:
 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AddFriendDto } from './dto/add-friend.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  prisma: PrismaService;

  async add(uid: number, data: AddFriendDto) {
    const friend = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });
    if (!friend) {
      throw new BadRequestException('username不存在');
    }
    if (friend.id === uid) {
      throw new BadRequestException('不能添加自己为好友');
    }

    const foundFriend = await this.prisma.friendShip.findMany({
      where: {
        uid: uid,
        friendId: friend.id,
      },
    });
    if (foundFriend.length) {
      throw new BadRequestException('不能重复添加好友');
    }
    return await this.prisma.friend_Request.create({
      data: {
        fromUid: uid,
        toUid: friend.id,
        reason: data.reason,
        status: 0,
      },
    });
  }

  // 获取好友申请列表
  async getFriendRequestList(uid: number) {
    const res = {
      fromMe: [],
      toMe: [],
    };
    const fromMeRequest = await this.prisma.friend_Request.findMany({
      where: {
        fromUid: uid,
        status: 0,
      },
    });
    const toMeRequest = await this.prisma.friend_Request.findMany({
      where: {
        toUid: uid,
        status: 0,
      },
    });

    for (let i = 0; i < fromMeRequest.length; i++) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: fromMeRequest[i].toUid,
        },
        select: {
          id: true,
          nickname: true,
          username: true,
          headePic: true,
          email: true,
        },
      });

      res.fromMe.push({
        ...fromMeRequest[i],
        toUser: user,
      });
    }

    for (let i = 0; i < toMeRequest.length; i++) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: toMeRequest[i].fromUid,
        },
        select: {
          id: true,
          nickname: true,
          username: true,
          headePic: true,
          email: true,
        },
      });

      res.toMe.push({
        ...toMeRequest[i],
        fromUser: user,
      });
    }

    return res;
  }

  // 同意添加好友
  async agree(friendId: number, uid: number) {
    console.log('agree>>>>>', friendId, uid);
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
  async getFriendShip(uid: number, name?: string) {
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

    let res = [];
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

    name && (res = res.filter((item: User) => item.nickname.includes(name)));

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
