import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getFeed(
    @Req() req: any,
    @Query('skip') skip = 0,
    @Query('limit') limit = 10,
  ) {
    return this.feedService.getFeed(
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }
}