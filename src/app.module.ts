/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-21 11:52:21
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 13:59:36
 * @Description:
 */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env',
    }),
    JwtModule.register({
      secret: 'yc',
      global: true,
      signOptions: {
        expiresIn: '2h',
      },
    }),
    PrismaModule,
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
