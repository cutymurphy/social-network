import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Get('following/:id')
  getFollowing(@Param('id') id: string) {
    return this.followsService.getFollowing(id);
  }

  @Get('followers/:id')
  getFollowers(@Param('id') id: string) {
    return this.followsService.getFollowers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  follow(@Req() req: any, @Param('id') followingId: string) {
    return this.followsService.followUser(req.user.userId, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  unfollow(@Req() req: any, @Param('id') followingId: string) {
    return this.followsService.unfollowUser(req.user.userId, followingId);
  }
}
