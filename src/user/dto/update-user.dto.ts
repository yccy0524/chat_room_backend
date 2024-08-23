import { IsNotEmpty } from 'class-validator';

export class UpdateUserInfoDto {
  @IsNotEmpty({
    message: '头像不能为空',
  })
  headPic: string;

  @IsNotEmpty({
    message: '昵称不能为空',
  })
  nickname: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
