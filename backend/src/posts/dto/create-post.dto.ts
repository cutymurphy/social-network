import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  caption!: string;

  @ApiProperty({ enum: ['image', 'video'] })
  @IsIn(['image', 'video'])
  mediaType!: 'image' | 'video';
}
