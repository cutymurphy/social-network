import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowDto } from './dto/follow.dto';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  follow(@Req() req: any, @Body() dto: FollowDto) {
    return this.followsService.followUser(req.user.userId, dto.followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unfollow(@Req() req: any, @Body() dto: FollowDto) {
    return this.followsService.unfollowUser(req.user.userId, dto.followingId);
  }

  @Get('following/:id')
  getFollowing(@Param('id') id: string) {
    return this.followsService.getFollowing(id);
  }

  @Get('followers/:id')
  getFollowers(@Param('id') id: string) {
    return this.followsService.getFollowers(id);
  }
}
