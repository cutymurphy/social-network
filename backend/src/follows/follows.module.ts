import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { SocialModule } from 'src/social/social.module';
import { FollowRequestsModule } from 'src/follow-requests/follow-requests.module';
import {
  Notification,
  NotificationSchema,
} from 'src/notifications/schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    SocialModule,
    FollowRequestsModule,
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
