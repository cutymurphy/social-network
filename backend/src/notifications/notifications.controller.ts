import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getMy(@Req() req: any, @Query('skip') skip = 0, @Query('limit') limit = 20) {
    return this.notificationsService.getUserNotifications(
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }

  @Get('unread-count')
  count(@Req() req: any) {
    return this.notificationsService.countUnread(req.user.userId);
  }

  @Patch(':id/read')
  mark(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }
}
