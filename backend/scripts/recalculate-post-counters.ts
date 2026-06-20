import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);

  const posts = mongoose.connection.collection('posts');
  const likes = mongoose.connection.collection('likes');
  const comments = mongoose.connection.collection('comments');

  const allPosts = await posts.find().toArray();

  for (const post of allPosts) {
    const likesCount = await likes.countDocuments({
      postId: post._id,
    });

    const commentsCount = await comments.countDocuments({
      postId: post._id,
    });

    await posts.updateOne(
      { _id: post._id },
      {
        $set: {
          likesCount,
          commentsCount,
        },
      },
    );

    console.log(`Updated post ${post._id}`);
  }

  console.log('DONE');
  process.exit(0);
}

run();