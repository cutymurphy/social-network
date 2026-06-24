import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getComments(
    @Param('postId') postId: string,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.commentsService.getCommentsByPost(
      postId,
      Number(skip),
      Number(limit),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(
      req.user.userId,
      dto.postId,
      dto.text,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: string) {
    return this.commentsService.deleteComment(id, req.user.userId);
  }
}
