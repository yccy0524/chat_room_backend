/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-23 15:39:16
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 16:19:57
 * @Description:
 */
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('require-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) return null;
    return data ? request.user[data] : request.user;
  },
);
