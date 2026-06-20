import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like } from './schemas/like.schema';
import { Post } from '../posts/schemas/post.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name)
    private likeModel: Model<Like>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    private notificationsService: NotificationsService,
  ) {}

  async likePost(userId: string, postId: string) {
    try {
      const existing = await this.likeModel.findOne({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });

      if (existing) {
        throw new ConflictException('Post already liked');
      }

      await this.likeModel.create({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });

      await this.postModel.updateOne(
        { _id: postId },
        { $inc: { likesCount: 1 } },
      );

      const post = await this.postModel.findById(postId);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post && post.authorId.toString() !== userId) {
        await this.notificationsService.create(
          'like',
          post.authorId.toString(),
          userId,
          postId,
        );
      }

      return { success: true };
    } catch (e: any) {
      if (e instanceof ConflictException) throw e;

      throw new InternalServerErrorException('Failed to like post');
    }
  }

  async unlikePost(userId: string, postId: string) {
    try {
      const deleted = await this.likeModel.deleteOne({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });

      if (deleted.deletedCount > 0) {
        await this.postModel.updateOne(
          { _id: postId },
          { $inc: { likesCount: -1 } },
        );
      }

      return { success: true };
    } catch {
      throw new InternalServerErrorException('Failed to unlike post');
    }
  }
}
