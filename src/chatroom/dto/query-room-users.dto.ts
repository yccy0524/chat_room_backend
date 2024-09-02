/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-30 16:00:41
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 16:02:02
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class QueryRoomUsers {
  @IsNotEmpty({
    message: 'roomId不能为空',
  })
  roomId: number;
}
