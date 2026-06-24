import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { Follow } from '../follows/schemas/follow.schema';
import { Like } from 'src/likes/schemas/like.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    @InjectModel(Like.name)
    private likeModel: Model<Like>,
  ) {}

  async getFeed(userId: string, skip = 0, limit = 15) {
    limit = Math.min(Math.max(limit, 1), 50);

    try {
      const followingIds = await this.followModel
        .find({
          followerId: new Types.ObjectId(userId),
        })
        .distinct('followingId');

      if (followingIds.length === 0) {
        return [];
      }

      const posts = await this.postModel
        .find({
          authorId: {
            $in: followingIds,
          },
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
        userId: new Types.ObjectId(userId),
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
    } catch {
      throw new InternalServerErrorException('Failed to load feed');
    }
  }
}
