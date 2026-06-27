import type { IUserPreview } from './user';

export type TMediaType = 'image' | 'video';

export interface IPost {
  _id: string;
  authorId: IUserPreview;
  mediaUrl: string;
  mediaType: TMediaType;
  caption: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePostRequest {
  file: File;
  caption: string;
  mediaType: TMediaType;
}
