import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { Like, LikeSchema } from 'src/likes/schemas/like.schema';
import { Comment, CommentSchema } from 'src/comments/schemas/comment.schema';
import { Follow, FollowSchema } from 'src/follows/schemas/follow.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/notifications/schemas/notification.schema';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    MediaModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
