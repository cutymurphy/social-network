import { Controller, Get, Param, Req } from '@nestjs/common';
import { SocialActionsService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialActionsService) {}

  @Get('status/:targetUserId')
  getStatus(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    return this.socialService.getStatus(req.user.userId, targetUserId);
  }
}
