import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  Query,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
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

  @Post(':id')
  follow(@Req() req: any, @Param('id') followingId: string) {
    return this.followsService.followUser(req.user.userId, followingId);
  }

  @Delete(':id')
  unfollow(@Req() req: any, @Param('id') followingId: string) {
    return this.followsService.unfollowUser(req.user.userId, followingId);
  }
}
