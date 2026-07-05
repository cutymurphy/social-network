import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow } from './schemas/follow.schema';
import { User } from '../users/schemas/user.schema';
import { FollowRequestsService } from 'src/follow-requests/follow-requests.service';
import { SocialActionsService } from 'src/social/social.service';
import {
  ENotificationTypes,
  Notification,
} from 'src/notifications/schemas/notification.schema';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    private socialActions: SocialActionsService,
    private followRequestsService: FollowRequestsService,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const followerObjectId = new Types.ObjectId(followerId);
    const followingObjectId = new Types.ObjectId(followingId);

    const targetUser = await this.userModel.findById(followingId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const alreadyFollowed = await this.followModel.findOne({
      followerId: followerObjectId,
      followingId: followingObjectId,
    });

    if (alreadyFollowed) {
      throw new ConflictException('Already following this user');
    }

    if (targetUser.isPrivate) {
      await this.followRequestsService.create(followerId, followingId);

      return {
        success: true,
        pending: true,
      };
    }

    return await this.socialActions.follow(followerId, followingId);
  }

  private async removeFollowRelation(followerId: string, followingId: string) {
    const result = await this.followModel.deleteOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Follow relation does not exist');
    }

    await this.notificationModel.deleteMany({
      type: ENotificationTypes.follow,
      fromUserId: new Types.ObjectId(followerId),
      userId: new Types.ObjectId(followingId),
    });

    await this.userModel.updateOne(
      { _id: followingId },
      { $inc: { followersCount: -1 } },
    );

    await this.userModel.updateOne(
      { _id: followerId },
      { $inc: { followingCount: -1 } },
    );

    return { success: true };
  }

  async unfollowUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot unfollow yourself');
    }

    return this.removeFollowRelation(followerId, followingId);
  }

  async removeFollower(userId: string, followerId: string) {
    if (userId === followerId) {
      throw new ConflictException('You cannot remove yourself');
    }

    return this.removeFollowRelation(followerId, userId);
  }

  async getFollowing(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);
    const followings = await this.followModel
      .find({
        followerId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate('followingId', 'nickname avatarUrl bio');

    const hasMore = followings.length > limit;
    if (hasMore) followings.pop();

    return {
      followings,
      hasMore,
    };
  }

  async getFollowers(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);
    const followers = await this.followModel
      .find({
        followingId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate('followerId', 'nickname avatarUrl bio');

    const hasMore = followers.length > limit;
    if (hasMore) followers.pop();

    return {
      followers,
      hasMore,
    };
  }
}
