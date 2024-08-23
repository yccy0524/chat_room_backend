import { IsNotEmpty } from 'class-validator';

/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-23 10:56:42
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 14:25:37
 * @Description:
 */
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
