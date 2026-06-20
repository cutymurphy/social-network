import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error('MONGO_URL is not defined');
  }

  await mongoose.connect(uri);

  const posts = mongoose.connection.collection('posts');
  const likes = mongoose.connection.collection('likes');
  const comments = mongoose.connection.collection('comments');

  const allPosts = await posts.find({}, { projection: { _id: 1 } }).toArray();

  const postIds = allPosts.map((p) => p._id);

  console.log(`Found posts: ${postIds.length}`);

  const likesResult = await likes.deleteMany({
    postId: { $nin: postIds },
  });

  console.log(`Deleted likes: ${likesResult.deletedCount}`);

  const commentsResult = await comments.deleteMany({
    postId: { $nin: postIds },
  });

  console.log(`Deleted comments: ${commentsResult.deletedCount}`);

  await mongoose.disconnect();

  console.log('Cleanup finished');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
