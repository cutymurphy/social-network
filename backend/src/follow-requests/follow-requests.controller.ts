import { Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { FollowRequestsService } from './follow-requests.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('follow-requests')
export class FollowRequestsController {
  constructor(private readonly followRequestsService: FollowRequestsService) {}

  @Get('incoming-count')
  countIncoming(@Req() req: any) {
    return this.followRequestsService.countIncoming(req.user.userId);
  }

  @Get('incoming')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getMyRequests(
    @Req() req: any,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.followRequestsService.getIncomingRequests(
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }

  @Get('outgoing')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getOutgoing(
    @Req() req: any,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.followRequestsService.getOutgoingRequests(
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }

  @Post(':id/accept')
  accept(@Req() req: any, @Param('id') requestId: string) {
    return this.followRequestsService.accept(requestId, req.user.userId);
  }

  @Post(':id/reject')
  reject(@Req() req: any, @Param('id') requesterId: string) {
    return this.followRequestsService.reject(requesterId, req.user.userId);
  }

  @Post(':id/cancel')
  async cancelFollowRequest(
    @Param('id') targetUserId: string,
    @Req() req: any,
  ) {
    return this.followRequestsService.cancel(targetUserId, req.user.userId);
  }
}
