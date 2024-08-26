/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 09:25:30
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-26 10:27:41
 * @Description: user
 */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils/util';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { UpdateUserInfoDto } from './dto/update-user.dto';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prisma: PrismaService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  private logger = new Logger();

  // 注册
  async register(registerUser: RegisterUserDto) {
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (registerUser.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prisma.user.findUnique({
      where: {
        username: registerUser.username,
      },
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.prisma.user.create({
        data: {
          username: registerUser.username,
          nickname: registerUser.nickname,
          password: md5(registerUser.password),
          email: registerUser.email,
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          email: true,
          headePic: true,
          createTime: true,
        },
      });
    } catch (err) {
      this.logger.error(err, UserService);
      return null;
    }
  }

  // 登录
  async login(loginUser: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: loginUser.username,
      },
    });
    if (!user) {
      throw new HttpException('用户名不正确', HttpStatus.BAD_REQUEST);
    }
    if (md5(loginUser.password) !== user.password) {
      throw new HttpException('密码不正确', HttpStatus.BAD_REQUEST);
    }
    const userInfo = new LoginUserVo();
    userInfo.username = user.username;
    userInfo.email = user.email;
    userInfo.headPic = user.headePic;
    userInfo.id = user.id;
    userInfo.nickname = user.nickname;
    userInfo.token = this.jwtService.sign(
      {
        uid: user.id,
        username: user.username,
      },
      {
        expiresIn: '7d',
      },
    );
    return userInfo;
  }

  // 更改用户信息
  async updateUserInfo(uid: number, updateUserInfo: UpdateUserInfoDto) {
    const captcha = await this.redisService.get(
      `captcha_${updateUserInfo.email}`,
    );

    if (!captcha || captcha !== updateUserInfo.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const updateUser = await this.prisma.user.update({
      where: {
        id: uid,
      },
      data: {
        headePic: updateUserInfo.headPic,
        nickname: updateUserInfo.nickname,
      },
    });
    const user = new UserInfoVo();
    user.id = updateUser.id;
    user.nickname = updateUser.nickname;
    user.username = updateUser.username;
    user.headPic = updateUser.headePic;
    user.email = updateUser.email;

    return user;
  }

  // 更改密码
  async updatePassword(data: UpdatePasswordDto) {
    const captcha = await this.redisService.get(`captcha_${data.email}`);
    if (!captcha || captcha !== data.captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: {
        username: data.username,
        email: data.email,
      },
      data: {
        password: md5(data.password),
      },
    });

    return '修改成功';
  }

  // 获取用户信息
  async getUserInfo(uid: number) {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    const user = new UserInfoVo();
    user.id = foundUser.id;
    user.nickname = foundUser.nickname;
    user.username = foundUser.username;
    user.headPic = foundUser.headePic;
    user.email = foundUser.email;

    return user;
  }

  // 获取好友
  async getFriendShip(uid: number) {
    const friends = await this.prisma.friendShip.findMany({
      where: {
        OR: [
          {
            uid: uid,
          },
          {
            friendId: uid,
          },
        ],
      },
    });

    const set = new Set<number>();
    friends.forEach((item) => {
      set.add(item.uid);
      set.add(item.friendId);
    });

    const uidList = Array.from([...set]).filter((item) => item !== uid);

    const res = [];
    for (let i = 0; i < uidList.length; i++) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: uidList[i],
        },
        select: {
          id: true,
          username: true,
          nickname: true,
          headePic: true,
          email: true,
        },
      });

      res.push(user);
    }

    return res;
  }
}
