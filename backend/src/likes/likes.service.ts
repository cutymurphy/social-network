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
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    try {
      await this.likeModel.create({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });
    } catch (e: any) {
      if (e.code === 11000) {
        throw new ConflictException('Post already liked');
      }
      throw new InternalServerErrorException('Failed to like post');
    }

    await this.postModel.updateOne(
      { _id: postId },
      { $inc: { likesCount: 1 } },
    );

    if (post.authorId.toString() !== userId) {
      await this.notificationsService.create(
        'like',
        post.authorId.toString(),
        userId,
        postId,
      );
    }

    return { success: true };
  }

  async unlikePost(userId: string, postId: string) {
    try {
      const deleted = await this.likeModel.deleteOne({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });

      if (deleted.deletedCount === 0) {
        throw new NotFoundException('Like does not exist');
      }

      await this.postModel.updateOne(
        { _id: postId },
        { $inc: { likesCount: -1 } },
      );

      return { success: true };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException('Failed to unlike post');
    }
  }
}
