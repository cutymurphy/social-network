import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class LikeDto {
  @ApiProperty({ example: '64f1c2a9b12a3c0012345678' })
  @IsMongoId()
  postId!: string;
}
