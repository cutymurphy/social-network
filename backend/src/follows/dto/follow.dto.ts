import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FollowDto {
  @ApiProperty({
    example: '64f1c2a9b12a3c0012345678',
    description: 'ID пользователя, на которого подписываемся',
  })
  @IsMongoId()
  followingId!: string;
}
