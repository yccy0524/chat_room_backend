/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 09:25:30
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-26 10:03:43
 * @Description:
 */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, UserInfo } from 'src/decorator';
import { UpdateUserInfoDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

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

  // 更改信息
  @RequireLogin()
  @Post('updateUserInfo')
  async updateUserInfo(
    @UserInfo('uid') uid: number,
    @Body() updateUserInfo: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfo(uid, updateUserInfo);
  }

  // 更改密码
  @Post('updatePassword')
  async updatePassword(@Body() data: UpdatePasswordDto) {
    return await this.userService.updatePassword(data);
  }

  // 获取用户信息
  @RequireLogin()
  @Get('getUserInfo')
  async getUserInfo(@UserInfo('uid') uid: number) {
    return await this.userService.getUserInfo(uid);
  }

  // 获取朋友列表
  @RequireLogin()
  @Get('friendship')
  async getFriendShip(@UserInfo('uid') uid: number) {
    return await this.userService.getFriendShip(uid);
  }
}
