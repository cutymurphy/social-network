import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);

  const users = mongoose.connection.collection('users');
  const follows = mongoose.connection.collection('follows');

  const allUsers = await users.find().toArray();

  for (const user of allUsers) {
    const followersCount = await follows.countDocuments({
      followingId: user._id,
    });

    const followingCount = await follows.countDocuments({
      followerId: user._id,
    });

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          followersCount,
          followingCount,
        },
      },
    );

    console.log(`Updated user ${user._id}`);
  }

  console.log('DONE');
  process.exit(0);
}

run();
