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
}
