import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
import { FeedModule } from './feed/feed.module';
import { FollowsModule } from './follows/follows.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FollowRequestsModule } from './follow-requests/follow-requests.module';
import { SocialModule } from './social/social.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    CommentsModule,
    FeedModule,
    FollowsModule,
    FollowRequestsModule,
    LikesModule,
    MediaModule,
    NotificationsModule,
    PostsModule,
    SocialModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
