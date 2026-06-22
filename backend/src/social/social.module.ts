import { Module } from '@nestjs/common';
import { SocialActionsService } from './social.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from 'src/follows/schemas/follow.schema';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  FollowRequest,
  FollowRequestSchema,
} from 'src/follow-requests/schemas/follow-request.schema';
import { SocialController } from './social.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: FollowRequest.name, schema: FollowRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationsModule,
  ],
  providers: [SocialActionsService],
  controllers: [SocialController],
  exports: [SocialActionsService],
})
export class SocialModule {}
