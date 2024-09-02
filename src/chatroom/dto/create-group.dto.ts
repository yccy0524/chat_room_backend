/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-30 13:49:56
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 13:51:46
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({
    message: '群聊名字不能为空',
  })
  roomName: string;
}
