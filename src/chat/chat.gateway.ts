/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-03 17:33:20
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-07 14:02:52
 * @Description:
 */
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';

interface JoinRoomPayload {
  chatroomId: number;
  uid: number;
}

interface SendMessagePayload {
  sendUid: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image';
    content: string;
  };
}

@WebSocketGateway({ cors: { orgin: '*' } })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer() server: Server;

  @Inject(ChatHistoryService)
  private chatHistoryService: ChatHistoryService;

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: JoinRoomPayload) {
    const roomName = payload.chatroomId.toString();
    client.join(roomName);
    this.server.to(roomName).emit('message', {
      type: 'joinRoom',
      uid: payload.uid,
    });
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString();
    await this.chatHistoryService.add(
      {
        type: payload.message.type === 'image' ? 1 : 0,
        content: payload.message.content,
        chatroomId: payload.chatroomId,
      },
      payload.sendUid,
    );
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      uid: payload.sendUid,
      message: payload.message,
    });
  }
}
