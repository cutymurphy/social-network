import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Follow } from '../follows/schemas/follow.schema';
import { User } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { ENotificationTypes } from 'src/notifications/schemas/notification.schema';
import { FollowRequest } from 'src/follow-requests/schemas/follow-request.schema';

@Injectable()
export class SocialActionsService {
  constructor(
    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    @InjectModel(FollowRequest.name)
    private followRequestModel: Model<FollowRequest>,

    @InjectModel(User.name)
    private userModel: Model<User>,

    private notificationsService: NotificationsService,
  ) {}

  async follow(
    followerId: string,
    followingId: string,
    needNotification: boolean = true,
  ) {
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

    if (needNotification) {
      await this.notificationsService.create(
        ENotificationTypes.follow,
        followingId,
        followerId,
      );
    }

    return { success: true };
  }

  async getStatus(currentUserId: string, targetUserId: string) {
    const currentId = new Types.ObjectId(currentUserId);
    const targetId = new Types.ObjectId(targetUserId);

    const [follow, outgoingRequest, incomingRequest] = await Promise.all([
      this.followModel.exists({
        followerId: currentId,
        followingId: targetId,
      }),

      this.followRequestModel.exists({
        requesterId: currentId,
        targetId,
      }),

      this.followRequestModel.exists({
        requesterId: targetId,
        targetId: currentId,
      }),
    ]);

    return {
      isFollowing: !!follow,
      hasOutgoingRequest: !!outgoingRequest,
      hasIncomingRequest: !!incomingRequest,
    };
  }
}
