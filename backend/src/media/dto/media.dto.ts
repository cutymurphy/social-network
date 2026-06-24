import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteMediaDto {
  @ApiProperty({ example: 'http://localhost:9000/posts/uuid-file.jpg' })
  @IsString()
  fileUrl!: string;
}

export const AVATAR_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const POST_FILE_TYPES = [
  ...AVATAR_FILE_TYPES,
  'video/mp4',
  'video/quicktime',
];
