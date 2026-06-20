import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsEnum(['like', 'comment', 'follow'])
  type!: 'like' | 'comment' | 'follow';

  @IsMongoId()
  userId!: string;

  @IsMongoId()
  fromUserId!: string;

  @IsOptional()
  @IsMongoId()
  postId?: string;
}
