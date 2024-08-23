/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 09:25:30
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 11:12:38
 * @Description:
 */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注册
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  // 登录
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return await this.userService.login(loginUser);
  }
}
