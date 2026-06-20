import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LikeDto } from './dto/like.dto';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  like(@Req() req: any, @Body() dto: LikeDto) {
    return this.likesService.likePost(req.user.userId, dto.postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  unlike(@Req() req: any, @Body() dto: LikeDto) {
    return this.likesService.unlikePost(req.user.userId, dto.postId);
  }

  //   @Get(':postId/count')
  //   count(@Param('postId') postId: string) {
  //     return this.likesService.countLikes(postId);
  //   }
}
