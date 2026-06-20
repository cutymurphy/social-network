import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { MediaService } from '../media/media.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
    private mediaService: MediaService,
  ) {}

  async createPost(authorId: string, dto: CreatePostDto, file?: any) {
    try {
      let mediaUrl = '';

      if (file) {
        mediaUrl = await this.mediaService.uploadFile(file);
      }

      if (!authorId) {
        throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
      }

      return await this.postModel.create({
        authorId: new Types.ObjectId(authorId),
        mediaUrl,
        mediaType: dto.mediaType,
        caption: dto.caption,
      });
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFeed(skip = 0, limit = 10) {
    return this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'nickname avatarUrl');
  }
}
