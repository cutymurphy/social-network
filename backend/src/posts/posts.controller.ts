import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';
import { createFileFilter } from 'src/media/media.helper';
import { POST_FILE_TYPES } from 'src/media/dto/media.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('user/:userId')
  @ApiQuery({ name: 'skip', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getUserPosts(
    @Req() req: any,
    @Param('userId') userId: string,
    @Query('skip') skip = 0,
    @Query('limit') limit = 20,
  ) {
    return this.postsService.getUserPosts(
      userId,
      req.user.userId,
      Number(skip),
      Number(limit),
    );
  }

  @Get(':id')
  getPost(@Req() req: any, @Param('id') postId: string) {
    return this.postsService.getPostById(req.user.userId, postId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 500 * 1024 * 1024 },
      fileFilter: createFileFilter(POST_FILE_TYPES),
    }),
  )
  create(
    @Req() req: any,
    @Body() dto: CreatePostDto,
    @UploadedFile() file: any,
  ) {
    return this.postsService.createPost(req.user.userId, dto, file);
  }

  @Delete(':id')
  deletePost(@Req() req: any, @Param('id') postId: string) {
    return this.postsService.deletePost(req.user.userId, postId);
  }
}
