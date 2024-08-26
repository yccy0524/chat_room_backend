/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:30:38
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-26 10:40:59
 * @Description:
 */
/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:30:38
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-26 10:31:54
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class AddFriendDto {
  @IsNotEmpty({
    message: '添加好友的uid不能为空',
  })
  uid: number;

  reason: string;
}
