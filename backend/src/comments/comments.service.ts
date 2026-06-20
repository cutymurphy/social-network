import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './schemas/comment.schema';
import { Post } from '../posts/schemas/post.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    private notificationsService: NotificationsService,
  ) {}

  async createComment(userId: string, postId: string, text: string) {
    try {
      if (!text) {
        throw new NotFoundException('Comment text is required');
      }

      const comment = await this.commentModel.create({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
        text,
      });

      await this.postModel.updateOne(
        { _id: postId },
        { $inc: { commentsCount: 1 } },
      );

      const post = await this.postModel.findById(postId);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post && post.authorId.toString() !== userId) {
        await this.notificationsService.create(
          'comment',
          post.authorId.toString(),
          userId,
          postId,
        );
      }

      return comment;
    } catch (e) {
      throw new InternalServerErrorException('Failed to create comment');
    }
  }

  async getCommentsByPost(postId: string) {
    try {
      return await this.commentModel
        .find({ postId: new Types.ObjectId(postId) })
        .sort({ createdAt: -1 })
        .populate('userId', 'nickname avatarUrl');
    } catch {
      throw new InternalServerErrorException('Failed to load comments');
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      const comment = await this.commentModel.findOne({
        _id: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(userId),
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      await this.commentModel.deleteOne({
        _id: comment._id,
      });

      await this.postModel.updateOne(
        { _id: comment.postId },
        { $inc: { commentsCount: -1 } },
      );

      return { success: true };
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete comment');
    }
  }
}
