import {
  Controller,
  Post,
  Delete,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  like(@Req() req: any, @Param('id') postId: string) {
    return this.likesService.likePost(req.user.userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  unlike(@Req() req: any, @Param('id') postId: string) {
    return this.likesService.unlikePost(req.user.userId, postId);
  }

  //   @Get(':postId/count')
  //   count(@Param('postId') postId: string) {
  //     return this.likesService.countLikes(postId);
  //   }
}
