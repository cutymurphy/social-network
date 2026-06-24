import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  oldPassword?: string;

  @ApiProperty({ example: '1234567' })
  @IsString()
  @MinLength(6)
  newPassword?: string;
}
