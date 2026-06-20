import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  email!: string;

  @Prop({ unique: true, required: true })
  nickname!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ default: '' })
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
