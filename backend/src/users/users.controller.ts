import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Patch,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.usersService.search(q);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('me/avatar')
  uploadAvatar(@Req() req: any, @UploadedFile() file: any) {
    return this.usersService.updateAvatar(req.user.userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  delete(@Req() req: any) {
    return this.usersService.deleteMe(req.user.userId);
  }
}
