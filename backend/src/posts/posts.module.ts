import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schemas/post.schema';
import { MediaModule } from '../media/media.module';
import { Like, LikeSchema } from '../likes/schemas/like.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import {
  Notification,
  NotificationSchema,
} from '../notifications/schemas/notification.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Follow, FollowSchema } from 'src/follows/schemas/follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
    MediaModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
