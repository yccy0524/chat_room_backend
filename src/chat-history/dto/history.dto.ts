/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-07 10:34:37
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-07 10:42:55
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class HistoryDto {
  @IsNotEmpty({
    message: 'content不能为空',
  })
  content: string;

  @IsNotEmpty({
    message: 'type不能为空',
  })
  type: number;

  @IsNotEmpty({
    message: 'chatroomId不能为空',
  })
  chatroomId: number;
}
