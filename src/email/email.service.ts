/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-22 11:32:04
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-23 14:13:24
 * @Description:
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.get('EMAIL_HOST'),
      port: configService.get('EMAIL_PORT'),
      secure: false,
      auth: {
        user: configService.get('EMAIL_ADDRESS'),
        pass: configService.get('EMAIL_AUTH_PASS'),
      },
    });
  }

  transporter: Transporter;

  private logger = new Logger();

  @Inject(RedisService)
  private redisService: RedisService;

  async sendCaptcha(email: string) {
    const captcha = Math.random().toString().slice(2, 6);
    try {
      await this.redisService.set(`captcha_${email}`, captcha, 60 * 5);
      await this.sendEmail({
        to: email,
        subject: `邮箱验证码`,
        html: `<p>您的邮箱验证码是：${captcha}</p>`,
      });

      return '发送成功';
    } catch (err) {
      this.logger.error(err, EmailService);
    }
  }

  async sendEmail(options: {
    to: string | Mail.Address;
    subject: string;
    html: string;
  }) {
    const { to, subject, html } = options;
    return await this.transporter.sendMail({
      from: {
        address: this.configService.get('EMAIL_ADDRESS'),
        name: '聊天室',
      },
      to,
      subject,
      html,
    });
  }
}
