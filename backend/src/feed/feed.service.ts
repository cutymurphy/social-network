import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import { Follow } from '../follows/schemas/follow.schema';

@Injectable()
export class FeedService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Follow.name)
    private followModel: Model<Follow>,
  ) {}

  async getFeed(userId: string, skip = 0, limit = 10) {
    try {
      const following = await this.followModel.find({
        followerId: new Types.ObjectId(userId),
      });

      const followingIds = following.map((f) => f.followingId);

      return await this.postModel
        .find({
          authorId: { $in: followingIds },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('authorId', 'nickname bio');
    } catch (e) {
      throw new InternalServerErrorException('Failed to load feed');
    }
  }
}
