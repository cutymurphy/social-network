import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPost(@Req() req: any, @Param('id') postId: string) {
    return this.postsService.getPostById(req.user.userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Req() req: any,
    @Body() dto: CreatePostDto,
    @UploadedFile() file: any,
  ) {
    return this.postsService.createPost(req.user.userId, dto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@Req() req: any, @Param('id') postId: string) {
    return this.postsService.deletePost(req.user.userId, postId);
  }
}
