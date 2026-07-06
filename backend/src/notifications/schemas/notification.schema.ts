import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum ENotificationTypes {
  like = 'like',
  comment = 'comment',
  follow = 'follow',
  follow_request = 'follow_request',
  follow_request_accepted = 'follow_request_accepted',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  type!: ENotificationTypes;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  fromUserId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: false })
  postId?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.index({
  userId: 1,
  createdAt: -1,
});
