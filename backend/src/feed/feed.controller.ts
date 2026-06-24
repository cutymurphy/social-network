import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 15 })
  getFeed(
    @Req() req: any,
    @Query('skip') skip = 0,
    @Query('limit') limit = 15,
  ) {
    return this.feedService.getFeed(
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }
}
