import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FollowRequest,
  FollowRequestDocument,
} from './schemas/follow-request.schema';
import {
  ENotificationTypes,
  Notification,
  NotificationDocument,
} from 'src/notifications/schemas/notification.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { SocialActionsService } from 'src/social/social.service';

@Injectable()
export class FollowRequestsService {
  constructor(
    @InjectModel(FollowRequest.name)
    private followRequestModel: Model<FollowRequestDocument>,

    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    private notificationsService: NotificationsService,
    private socialActions: SocialActionsService,
  ) {}

  async create(requesterId: string, targetId: string) {
    try {
      await this.followRequestModel.create({
        requesterId: new Types.ObjectId(requesterId),
        targetId: new Types.ObjectId(targetId),
      });

      await this.notificationsService.create(
        ENotificationTypes.follow_request,
        targetId,
        requesterId,
      );
    } catch (e: any) {
      if (e.code === 11000) {
        throw new ConflictException('Follow request already exists');
      }

      throw e;
    }
  }

  async getIncomingRequests(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);
    const incomingRequests = await this.followRequestModel
      .find({
        targetId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate('requesterId', 'nickname avatarUrl');

    const hasMore = incomingRequests.length > limit;
    if (hasMore) incomingRequests.pop();

    return {
      incomingRequests,
      hasMore,
    };
  }

  async getOutgoingRequests(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);
    const outgoingRequests = await this.followRequestModel
      .find({
        requesterId: new Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate('targetId', 'nickname avatarUrl');

    const hasMore = outgoingRequests.length > limit;
    if (hasMore) outgoingRequests.pop();

    return {
      outgoingRequests,
      hasMore,
    };
  }

  async accept(requestId: string, currentUserId: string) {
    const request = await this.followRequestModel.findById(requestId);

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    if (request.targetId.toString() !== currentUserId) {
      throw new ForbiddenException();
    }

    const followerId = request.requesterId.toString();
    const followingId = request.targetId.toString();

    await this.socialActions.follow(followerId, followingId, false);

    await this.removeRequest(request);

    await this.notificationsService.create(
      ENotificationTypes.follow_request_accepted,
      followerId,
      followingId,
    );

    return {
      success: true,
    };
  }

  async approveAllForTarget(targetId: string) {
    const requests = await this.followRequestModel.find({
      targetId: new Types.ObjectId(targetId),
    });

    for (const request of requests) {
      await this.socialActions.follow(
        request.requesterId.toString(),
        request.targetId.toString(),
        false,
      );
    }

    await this.followRequestModel.deleteMany({
      targetId: new Types.ObjectId(targetId),
    });

    await this.notificationModel.deleteMany({
      type: ENotificationTypes.follow_request,
      userId: new Types.ObjectId(targetId),
    });
  }

  private async removeRequest(request: FollowRequestDocument) {
    await this.followRequestModel.deleteOne({ _id: request._id });

    await this.notificationModel.deleteOne({
      type: ENotificationTypes.follow_request,
      userId: request.targetId,
      fromUserId: request.requesterId,
    });
  }

  async reject(requesterId: string, currentUserId: string) {
    const request = await this.followRequestModel.findOne({
      requesterId: new Types.ObjectId(requesterId),
      targetId: new Types.ObjectId(currentUserId),
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    await this.removeRequest(request);

    return { success: true };
  }

  async cancel(targetUserId: string, currentUserId: string) {
    const request = await this.followRequestModel.findOne({
      requesterId: new Types.ObjectId(currentUserId),
      targetId: new Types.ObjectId(targetUserId),
    });

    if (!request) {
      throw new NotFoundException('Follow request not found');
    }

    await this.removeRequest(request);

    return { success: true };
  }
}
