import type { IUserPreview } from './user';

export enum ENotificationType {
  like = 'like',
  comment = 'comment',
  follow = 'follow',
  follow_request = 'follow_request',
  follow_request_accepted = 'follow_request_accepted',
}

export interface INotification {
  _id: string;
  userId: string;
  type: ENotificationType;
  fromUserId: IUserPreview;
  postId?: string;
  read: boolean;
  createdAt: string;
}
