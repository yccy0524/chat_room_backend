/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-09-02 14:39:47
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-02 15:06:47
 * @Description:
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map, Observable } from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          msg: 'success',
          status: 0,
        };
      }),
    );
  }
}
