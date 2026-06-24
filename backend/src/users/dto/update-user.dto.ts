import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'superdash' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: 'hi everyone!' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
