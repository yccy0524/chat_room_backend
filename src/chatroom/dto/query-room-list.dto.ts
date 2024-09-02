/*
 * @Author: yancheng 404174228@qq.com
 * @Date: 2024-08-30 14:09:47
 * @LastEditors: yancheng 404174228@qq.com
 * @LastEditTime: 2024-08-30 14:35:19
 * @Description:
 */
import { IsNotEmpty } from 'class-validator';

export class QueryRoomListDto {
  @IsNotEmpty({
    message: 'pageNum不能为空',
  })
  pageNum: number;

  @IsNotEmpty({
    message: 'pageSize不能为空',
  })
  pageSize: number;
}
