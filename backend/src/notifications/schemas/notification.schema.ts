import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  type!: 'like' | 'comment' | 'follow';

  @Prop({ type: Types.ObjectId, ref: 'User' })
  fromUserId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: false })
  postId?: Types.ObjectId;

  @Prop({ default: false })
  read!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
