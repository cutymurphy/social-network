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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

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

  @Get()
  feed(@Query('skip') skip = 0, @Query('limit') limit = 10) {
    return this.postsService.getFeed(Number(skip), Number(limit));
  }
}
