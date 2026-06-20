import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'test@mail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'nickname123' })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  nickname!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;
}
