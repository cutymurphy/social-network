import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Patch,
  Delete,
  Body,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  search(
    @Query('q') q: string,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.usersService.search(q, Number(skip), Number(limit));
  }

  @Get('me')
  me(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('me/avatar')
  uploadAvatar(@Req() req: any, @UploadedFile() file: any) {
    return this.usersService.updateAvatar(req.user.userId, file);
  }

  @Patch('me')
  update(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @Patch('me/password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }

  @Delete('me')
  delete(@Req() req: any) {
    return this.usersService.deleteMe(req.user.userId);
  }
}
