import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true, maxlength: 30, minlength: 3 })
  nickname!: string;

  @Prop({ default: '', maxlength: 150 })
  bio!: string;

  @Prop({ default: false })
  isPrivate!: boolean;

  @Prop({ default: 0 })
  followersCount!: number;

  @Prop({ default: 0 })
  followingCount!: number;

  @Prop({ default: '' })
  avatarUrl!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop()
  refreshTokenHash?: string;

  @Prop({ type: Date, default: null })
  notificationsLastSeenAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nickname: 1 }, { unique: true });
