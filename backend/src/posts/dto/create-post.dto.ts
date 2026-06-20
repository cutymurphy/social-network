import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post' })
  @IsString()
  caption!: string;

  @ApiProperty({ enum: ['image', 'video'], example: 'image' })
  @IsIn(['image', 'video'])
  mediaType!: 'image' | 'video';
}
