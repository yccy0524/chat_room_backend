/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-23 14:37:11
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 15:56:57
 * @Description:
 */
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

interface JwtUserData {
  uid: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requireLogin) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new HttpException('用户未登录', HttpStatus.UNAUTHORIZED);
    }
    try {
      const token = authorization.split(' ')[1];

      const userInfo = this.jwtService.verify<JwtUserData>(token);
      console.log('userInfo', userInfo);
      request.user = {
        uid: userInfo.uid,
        username: userInfo.username,
      };

      response.header(
        'token',
        this.jwtService.sign({
          uid: userInfo.uid,
          username: userInfo.username,
        }),
      );

      return true;
    } catch (err) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
