import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostsModule,
    MediaModule,
    FeedModule,
    FollowsModule,
    LikesModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
