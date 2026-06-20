import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like, LikeSchema } from './schemas/like.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    NotificationsModule,
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
