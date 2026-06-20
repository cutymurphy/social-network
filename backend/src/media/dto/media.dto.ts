import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteMediaDto {
  @ApiProperty({ example: 'http://localhost:9000/posts/uuid-file.jpg' })
  @IsString()
  fileUrl!: string;
}
