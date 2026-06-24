import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ENotificationTypes,
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(
    type: ENotificationTypes,
    userId: string,
    fromUserId: string,
    postId?: string,
  ) {
    try {
      return await this.notificationModel.create({
        type,
        userId: new Types.ObjectId(userId),
        fromUserId: new Types.ObjectId(fromUserId),
        postId: postId ? new Types.ObjectId(postId) : undefined,
      });
    } catch {
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async getUserNotifications(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);
    try {
      const notifications = await this.notificationModel
        .find({
          userId: new Types.ObjectId(userId),
        })
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit + 1)
        .populate('fromUserId', 'nickname avatarUrl');

      const hasMore = notifications.length > limit;
      if (hasMore) notifications.pop();

      return {
        notifications,
        hasMore,
      };
    } catch {
      throw new InternalServerErrorException('Failed to load notifications');
    }
  }

  async markAsRead(id: string, userId: string) {
    try {
      const result = await this.notificationModel.updateOne(
        {
          _id: new Types.ObjectId(id),
          userId: new Types.ObjectId(userId),
        },
        {
          $set: {
            read: true,
          },
        },
      );

      if (result.matchedCount === 0) {
        throw new NotFoundException('Notification not found');
      }

      return { success: true };
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }

      throw new InternalServerErrorException('Failed to update notification');
    }
  }

  async countUnread(userId: string) {
    try {
      return await this.notificationModel.countDocuments({
        userId: new Types.ObjectId(userId),
        read: false,
      });
    } catch {
      throw new InternalServerErrorException('Failed to count notifications');
    }
  }
}
