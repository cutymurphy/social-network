import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FollowRequest,
  FollowRequestSchema,
} from './schemas/follow-request.schema';
import { FollowRequestsController } from './follow-requests.controller';
import { FollowRequestsService } from './follow-requests.service';
import {
  Notification,
  NotificationSchema,
} from 'src/notifications/schemas/notification.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { SocialModule } from 'src/social/social.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FollowRequest.name,
        schema: FollowRequestSchema,
      },
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
    NotificationsModule,
    SocialModule,
  ],
  controllers: [FollowRequestsController],
  providers: [FollowRequestsService],
  exports: [FollowRequestsService],
})
export class FollowRequestsModule {}
