import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FollowRequestsService } from './follow-requests.service';

@Controller('follow-requests')
@UseGuards(JwtAuthGuard)
export class FollowRequestsController {
  constructor(private readonly followRequestsService: FollowRequestsService) {}

  @Get('incoming')
  getMyRequests(@Req() req: any) {
    return this.followRequestsService.getIncomingRequests(req.user.userId);
  }

  @Get('outgoing')
  getOutgoing(@Req() req: any) {
    return this.followRequestsService.getOutgoingRequests(req.user.userId);
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
