/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-26 10:30:38
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-03 15:43:11
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
    message: '添加好友的username不能为空',
  })
  username: string;

  reason: string;
}
