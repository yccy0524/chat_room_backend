/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-04 09:44:39
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-07 11:39:41
 * @Description:
 */
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HistoryDto } from './dto/history.dto';

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  async list(chatroomId: number) {
    const historyList = await this.prisma.chatHistory.findMany({
      where: {
        chatroomId,
      },
    });
    const list = [];
    for (let i = 0; i < historyList.length; i++) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: historyList[i].uid,
        },
        select: {
          id: true,
          headePic: true,
          email: true,
          username: true,
          nickname: true,
        },
      });

      list.push({
        ...historyList[i],
        user,
      });
    }

    return list;
  }

  async add(data: HistoryDto, uid: number) {
    return await this.prisma.chatHistory.create({
      data: {
        ...data,
        uid,
      },
    });
  }
}
