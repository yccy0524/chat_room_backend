/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-03 17:33:20
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-03 17:55:40
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
  sendMessage(@MessageBody() payload: SendMessagePayload) {
    const roomName = payload.chatroomId.toString();
    this.server.to(roomName).emit('message', {
      type: 'sendMessage',
      uid: payload.sendUid,
      message: payload.message,
    });
  }
}
