import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { MediaService } from '../media/media.service';
import { Like } from 'src/likes/schemas/like.schema';
import { Comment } from 'src/comments/schemas/comment.schema';
import { Notification } from 'src/notifications/schemas/notification.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,

    @InjectModel(Like.name)
    private likeModel: Model<Like>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    private mediaService: MediaService,
  ) {}

  async createPost(authorId: string, dto: CreatePostDto, file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const mediaUrl = await this.mediaService.uploadFile(file);

      return await this.postModel.create({
        authorId: new Types.ObjectId(authorId),
        mediaUrl,
        mediaType: dto.mediaType,
        caption: dto.caption,
      });
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to create post');
    }
  }

  async deletePost(userId: string, postId: string) {
    try {
      const post = await this.postModel.findById(postId);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.authorId.toString() !== userId) {
        throw new ForbiddenException('You can delete only your own posts');
      }

      await this.likeModel.deleteMany({
        postId: post._id,
      });

      await this.commentModel.deleteMany({
        postId: post._id,
      });

      await this.notificationModel.deleteMany({
        postId: post._id,
      });

      if (post.mediaUrl) {
        await this.mediaService.deleteFile(post.mediaUrl);
      }

      await post.deleteOne();

      return { success: true };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Failed to delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFeed(skip = 0, limit = 10) {
    limit = Math.min(limit, 50);

    return this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'nickname avatarUrl');
  }
}
