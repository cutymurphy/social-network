import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'anna',
  })
  username!: string;

  @ApiProperty({
    example: 'anna@mail.com',
  })
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  password!: string;
}
