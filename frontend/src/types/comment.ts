import type { IUserPreview } from './user';

export interface IComment {
  _id: string;
  userId: IUserPreview;
  postId: string;
  text: string;
  createdAt: string;
}

export interface ICreateCommentRequest {
  postId: string;
  text: string;
}
