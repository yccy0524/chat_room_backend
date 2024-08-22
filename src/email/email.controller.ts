/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 11:32:04
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-22 15:34:47
 * @Description: email
 */
import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('sendCaptcha')
  async getCaptcha(@Query('email') email: string) {
    return await this.emailService.sendCaptcha(email);
  }
}
