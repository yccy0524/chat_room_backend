/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-21 11:52:21
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-09-02 15:11:21
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
