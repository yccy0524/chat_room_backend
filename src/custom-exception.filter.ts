import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();
    const res = exception.getResponse() as { message: any };
    return response.json({
      msg: Array.isArray(res.message)
        ? res.message.join('、')
        : exception.message,
      status: exception.getStatus(),
      data: null,
    });
  }
}
