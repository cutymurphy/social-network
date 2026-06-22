import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SocialActionsService } from './social.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('social')
export class SocialController {
  constructor(private socialService: SocialActionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status/:targetUserId')
  getStatus(@Req() req: any, @Param('targetUserId') targetUserId: string) {
    return this.socialService.getStatus(req.user.userId, targetUserId);
  }
}
