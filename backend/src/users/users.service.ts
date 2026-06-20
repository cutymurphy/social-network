import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Post } from '../posts/schemas/post.schema';
import { Like } from '../likes/schemas/like.schema';
import { Comment } from '../comments/schemas/comment.schema';
import { Follow } from '../follows/schemas/follow.schema';
import { Notification } from '../notifications/schemas/notification.schema';
import { MediaService } from 'src/media/media.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Post.name)
    private postModel: Model<Post>,

    @InjectModel(Like.name)
    private likeModel: Model<Like>,

    @InjectModel(Comment.name)
    private commentModel: Model<Comment>,

    @InjectModel(Follow.name)
    private followModel: Model<Follow>,

    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,

    private mediaService: MediaService,
  ) {}

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user id');
    }

    const user = await this.userModel
      .findById(id)
      .select('nickname avatarUrl bio followersCount followingCount isPrivate');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async search(query: string) {
    return this.userModel
      .find({
        nickname: { $regex: query, $options: 'i' },
      })
      .limit(20)
      .select('nickname avatarUrl bio');
  }

  async getMe(userId: string) {
    return this.userModel.findById(userId).select('-passwordHash -__v');
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    const updateData: any = {};

    if (dto.nickname !== undefined) updateData.nickname = dto.nickname;
    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.isPrivate !== undefined) updateData.isPrivate = dto.isPrivate;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;

    if (dto.nickname) {
      const exists = await this.userModel.findOne({
        nickname: dto.nickname,
        _id: { $ne: userId },
      });

      if (exists) {
        throw new ConflictException('Nickname already taken');
      }
    }

    return this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select('-passwordHash -createdAt -updatedAt -__v');
  }

  async deleteMe(userId: string) {
    const id = new Types.ObjectId(userId);

    const posts = await this.postModel.find({ authorId: id });

    for (const post of posts) {
      if (post.mediaUrl) {
        await this.mediaService.deleteFile(post.mediaUrl);
      }
    }

    const user = await this.userModel.findById(id);

    if (user?.avatarUrl) {
      await this.mediaService.deleteFile(user.avatarUrl);
    }

    await Promise.all([
      this.postModel.deleteMany({ authorId: id }),
      this.likeModel.deleteMany({ userId: id }),
      this.commentModel.deleteMany({ userId: id }),
    ]);

    const following = await this.followModel.find({
      followerId: id,
    });

    const followers = await this.followModel.find({
      followingId: id,
    });

    await this.followModel.deleteMany({
      $or: [{ followerId: id }, { followingId: id }],
    });

    await this.notificationModel.deleteMany({
      $or: [{ userId: id }, { fromUserId: id }],
    });

    await this.userModel.updateMany(
      { _id: { $in: following.map((f) => f.followingId) } },
      { $inc: { followersCount: -1 } },
    );

    await this.userModel.updateMany(
      { _id: { $in: followers.map((f) => f.followerId) } },
      { $inc: { followingCount: -1 } },
    );

    await this.userModel.deleteOne({ _id: id });

    return { success: true };
  }
}
