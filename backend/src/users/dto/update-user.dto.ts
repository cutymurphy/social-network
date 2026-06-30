import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'superdash' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  nickname?: string;

  @ApiProperty({ example: 'hi everyone!' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  bio?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
