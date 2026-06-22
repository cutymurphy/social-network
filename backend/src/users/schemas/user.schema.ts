import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  nickname!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ default: '', maxlength: 200 })
  bio!: string;

  @Prop({ default: false })
  isPrivate!: boolean;

  @Prop({ default: 0 })
  followersCount!: number;

  @Prop({ default: 0 })
  followingCount!: number;

  @Prop({ default: '' })
  avatarUrl!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ nickname: 1 }, { unique: true });