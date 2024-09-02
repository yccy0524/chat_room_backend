/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-30 11:21:47
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 13:46:09
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class CreateOneToOneDto {
  @IsNotEmpty({
    message: 'friendId不能为空',
  })
  friendId: number;
}
