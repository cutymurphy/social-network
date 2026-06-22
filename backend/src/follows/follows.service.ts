import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow } from './schemas/follow.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    @InjectModel(User.name)
    private userModel: Model<User>,

    private notificationsService: NotificationsService,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot follow yourself');
    }

    const targetUser = await this.userModel.findById(followingId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.followModel.create({
        followerId: new Types.ObjectId(followerId),
        followingId: new Types.ObjectId(followingId),
      });

      await this.userModel.updateOne(
        { _id: followingId },
        { $inc: { followersCount: 1 } },
      );

      await this.userModel.updateOne(
        { _id: followerId },
        { $inc: { followingCount: 1 } },
      );

      await this.notificationsService.create('follow', followingId, followerId);

      return { success: true };
    } catch (e: any) {
      if (e.code === 11000) {
        throw new ConflictException('Already following this user');
      }
      throw e;
    }
  }

  async unfollowUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new ConflictException('You cannot unfollow yourself');
    }

    const result = await this.followModel.deleteOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Follow relation does not exist');
    }

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

  async getFollowing(userId: string) {
    return this.followModel
      .find({
        followerId: new Types.ObjectId(userId),
      })
      .populate('followingId', 'nickname avatarUrl');
  }

  async getFollowers(userId: string) {
    return this.followModel
      .find({
        followingId: new Types.ObjectId(userId),
      })
      .populate('followerId', 'nickname avatarUrl');
  }
}
