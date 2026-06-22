import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FollowRequestDocument = HydratedDocument<FollowRequest>;

@Schema({ timestamps: true })
export class FollowRequest {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  requesterId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  targetId!: Types.ObjectId;
}

export const FollowRequestSchema = SchemaFactory.createForClass(FollowRequest);

FollowRequestSchema.index(
  {
    requesterId: 1,
    targetId: 1,
  },
  {
    unique: true,
  },
);
