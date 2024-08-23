/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-21 11:52:21
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 15:12:58
 * @Description:
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
