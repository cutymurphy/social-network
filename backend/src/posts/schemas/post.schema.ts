import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId!: Types.ObjectId;

  @Prop({ required: true })
  mediaUrl!: string;

  @Prop({ required: true })
  mediaType!: 'image' | 'video';

  @Prop({ required: true, maxlength: 2200 })
  caption!: string;

  @Prop({ default: 0 })
  likesCount!: number;

  @Prop({ default: 0 })
  commentsCount!: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({
  authorId: 1,
  createdAt: -1,
});
