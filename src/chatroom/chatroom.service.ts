import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOneToOneDto } from './dto/create-one-to-one.dto';
import { QueryRoomListDto } from './dto/query-room-list.dto';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async createOneToOne(data: CreateOneToOneDto, uid: number) {
    const room = await this.prisma.chatroom.create({
      data: {
        name: `聊天室_${Math.random().toString().slice(2, 8)}`,
      },
      select: { id: true },
    });
    await this.prisma.userChatroom.create({
      data: {
        uid,
        chatroomId: room.id,
      },
    });
    await this.prisma.userChatroom.create({
      data: {
        uid: data.friendId,
        chatroomId: room.id,
      },
    });

    return '创建单聊成功';
  }

  // 创建群聊
  async createGroupChatroom(roomName: string, uid: number) {
    const { id } = await this.prisma.chatroom.create({
      data: {
        name: roomName,
        type: true,
      },
      select: {
        id: true,
      },
    });

    await this.prisma.userChatroom.create({
      data: {
        uid,
        chatroomId: id,
      },
    });
    return '创建群聊成功';
  }

  // 查看所有群聊
  async getRoomList(data: QueryRoomListDto, uid: number) {
    const { pageNum, pageSize } = data;
    const roomIdList = await this.prisma.userChatroom.findMany({
      where: {
        uid,
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      select: {
        chatroomId: true,
      },
    });

    const list = await this.prisma.chatroom.findMany({
      where: {
        id: {
          in: roomIdList.map((item) => item.chatroomId),
        },
        name: {
          contains: data.roomName,
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createTime: true,
      },
    });

    const res = [];

    for (let i = 0; i < list.length; i++) {
      const userIds = await this.prisma.userChatroom.findMany({
        where: {
          chatroomId: list[i].id,
        },
      });
      res.push({
        ...list[i],
        userCount: userIds.length,
        uids: userIds.map((itm) => itm.uid),
      });
    }

    return res;
  }

  // 查询聊天室所有用户
  async getUsersByChatroomId(roomId: number) {
    const userIds = await this.prisma.userChatroom.findMany({
      where: {
        chatroomId: roomId,
      },
      select: {
        uid: true,
      },
    });

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds.map((item) => item.uid),
        },
      },
      select: {
        id: true,
        nickname: true,
        username: true,
        email: true,
        headePic: true,
        createTime: true,
      },
    });

    return users;
  }

  // 查询聊天室所有信息
  async getChatroomInfo(roomId: number) {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    return { ...room, users: await this.getUsersByChatroomId(roomId) };
  }

  // 加入群聊
  async joinChatroom(roomId: number, uid: number) {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    if (!room.type) {
      throw new BadRequestException('一对一群聊不能加入');
    }
    await this.prisma.userChatroom.create({
      data: {
        uid,
        chatroomId: roomId,
      },
    });
    return '加入群聊成功';
  }

  // 退出群聊
  async quitChatroom(roomId: number, uid: number) {
    const room = await this.prisma.chatroom.findUnique({
      where: { id: roomId },
    });

    if (!room.type) {
      throw new BadRequestException('一对一群聊不能退出群聊');
    }
    await this.prisma.userChatroom.deleteMany({
      where: {
        chatroomId: roomId,
        uid,
      },
    });

    return '已退出群聊';
  }
}
