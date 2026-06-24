import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Get('following/:id')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getFollowing(
    @Param('id') id: string,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.followsService.getFollowing(id, Number(skip), Number(limit));
  }

  @Get('followers/:id')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getFollowers(
    @Param('id') id: string,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.followsService.getFollowers(id, Number(skip), Number(limit));
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
