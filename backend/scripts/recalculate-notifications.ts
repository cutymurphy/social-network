import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';

import {
  ENotificationTypes,
  Notification,
  NotificationSchema,
} from '../src/notifications/schemas/notification.schema';

import { Like, LikeSchema } from '../src/likes/schemas/like.schema';

import { Comment, CommentSchema } from '../src/comments/schemas/comment.schema';

import { Follow, FollowSchema } from '../src/follows/schemas/follow.schema';

import { Post, PostSchema } from '../src/posts/schemas/post.schema';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);

  const NotificationModel = mongoose.model(
    Notification.name,
    NotificationSchema,
  );

  const LikeModel = mongoose.model(Like.name, LikeSchema);

  const CommentModel = mongoose.model(Comment.name, CommentSchema);

  const FollowModel = mongoose.model(Follow.name, FollowSchema);

  const PostModel = mongoose.model(Post.name, PostSchema);

  await NotificationModel.deleteMany({});

  console.log('Notifications cleared');

  const likes = await LikeModel.find();

  for (const like of likes) {
    const post = await PostModel.findById(like.postId);

    if (!post) {
      continue;
    }

    if (post.authorId.toString() === like.userId.toString()) {
      continue;
    }

    await NotificationModel.create({
      type: ENotificationTypes.like,
      userId: post.authorId,
      fromUserId: like.userId,
      postId: like.postId,
    });
  }

  console.log(`Likes notifications: ${likes.length}`);

  const comments = await CommentModel.find();

  for (const comment of comments) {
    const post = await PostModel.findById(comment.postId);

    if (!post) {
      continue;
    }

    if (post.authorId.toString() === comment.userId.toString()) {
      continue;
    }

    await NotificationModel.create({
      type: ENotificationTypes.comment,
      userId: post.authorId,
      fromUserId: comment.userId,
      postId: comment.postId,
    });
  }

  console.log(`Comments notifications: ${comments.length}`);

  const follows = await FollowModel.find();

  for (const follow of follows) {
    await NotificationModel.create({
      type: ENotificationTypes.follow,
      userId: follow.followingId,
      fromUserId: follow.followerId,
    });
  }

  console.log(`Follow notifications: ${follows.length}`);

  console.log('Done');

  await mongoose.disconnect();
}

run();
