import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ENotificationTypes,
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
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

  private async getLastSeenAt(userId: string): Promise<Date | null> {
    const user = await this.userModel
      .findById(userId)
      .select('notificationsLastSeenAt')
      .lean();

    return user?.notificationsLastSeenAt ?? null;
  }

  private isRead(createdAt: Date, lastSeenAt: Date | null): boolean {
    if (!lastSeenAt) {
      return false;
    }

    return createdAt <= lastSeenAt;
  }

  async getUserNotifications(userId: string, skip = 0, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);

    try {
      const lastSeenAt = await this.getLastSeenAt(userId);

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
        notifications: notifications.map((notification) => {
          const item = notification.toObject();

          return {
            ...item,
            read: this.isRead(item.createdAt ?? new Date(0), lastSeenAt),
          };
        }),
        hasMore,
      };
    } catch {
      throw new InternalServerErrorException('Failed to load notifications');
    }
  }

  async markAsSeen(userId: string) {
    try {
      await this.userModel.updateOne(
        { _id: new Types.ObjectId(userId) },
        { $set: { notificationsLastSeenAt: new Date() } },
      );

      return { success: true };
    } catch {
      throw new InternalServerErrorException(
        'Failed to mark notifications as seen',
      );
    }
  }

  async countUnread(userId: string) {
    try {
      const lastSeenAt = await this.getLastSeenAt(userId);
      const filter: Record<string, unknown> = {
        userId: new Types.ObjectId(userId),
      };

      if (lastSeenAt) {
        filter.createdAt = { $gt: lastSeenAt };
      }

      return await this.notificationModel.countDocuments(filter);
    } catch {
      throw new InternalServerErrorException('Failed to count notifications');
    }
  }
}
