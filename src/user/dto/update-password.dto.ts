/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-23 16:34:55
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 16:39:21
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
