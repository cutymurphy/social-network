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
import { User } from 'src/users/schemas/user.schema';
import { Follow } from 'src/follows/schemas/follow.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,

    @InjectModel(Like.name)
    private likeModel: Model<Like>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    private mediaService: MediaService,
  ) {}

  async getUserPosts(
    targetUserId: string,
    currentUserId?: string,
    skip = 0,
    limit = 20,
  ) {
    skip = Math.max(0, skip);
    limit = Math.min(Math.max(1, limit), 50);

    const user = await this.userModel.findById(targetUserId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isPrivate && currentUserId !== targetUserId) {
      const follow = await this.followModel.exists({
        followerId: new Types.ObjectId(currentUserId),
        followingId: new Types.ObjectId(targetUserId),
      });

      if (!follow) {
        throw new ForbiddenException('Profile is private');
      }
    }

    const posts = await this.postModel
      .find({
        authorId: new Types.ObjectId(targetUserId),
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit + 1)
      .populate('authorId', 'nickname avatarUrl');

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    const postIds = posts.map((p) => p._id);

    const likes = await this.likeModel.find({
      userId: new Types.ObjectId(currentUserId),
      postId: { $in: postIds },
    });

    const likedPostIds = new Set(likes.map((like) => like.postId.toString()));

    return {
      posts: posts.map((post) => ({
        ...post.toObject(),
        isLiked: likedPostIds.has(post._id.toString()),
      })),
      hasMore,
    };
  }

  async getPostById(currentUserId: string, postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new BadRequestException('Invalid post id');
    }

    const post = await this.postModel
      .findById(postId)
      .populate('authorId', 'nickname avatarUrl isPrivate');

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const author = post.authorId as any;

    if (author.isPrivate && author._id.toString() !== currentUserId) {
      const isFollowing = await this.followModel.exists({
        followerId: new Types.ObjectId(currentUserId),
        followingId: author._id,
      });

      if (!isFollowing) {
        throw new ForbiddenException('This post is private');
      }
    }

    const isLiked = await this.likeModel.exists({
      userId: new Types.ObjectId(currentUserId),
      postId: post._id,
    });

    return {
      ...post.toObject(),
      isLiked: !!isLiked,
    };
  }

  async createPost(authorId: string, dto: CreatePostDto, file: any) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.includes(dto.mediaType)) {
      throw new BadRequestException('Media type is incorrect');
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
}
