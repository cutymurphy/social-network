import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '64f1c2a9b12a3c0012345678' })
  @IsMongoId()
  postId!: string;

  @ApiProperty({ example: 'nice post!' })
  @IsString()
  @MinLength(1)
  text!: string;
}
