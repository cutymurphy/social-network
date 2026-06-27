import type { IUserPreview } from './user';

export interface IFollowEdgeFollowing {
  _id: string;
  followerId: string;
  followingId: IUserPreview;
  createdAt: string;
}

export interface IFollowEdgeFollower {
  _id: string;
  followerId: IUserPreview;
  followingId: string;
  createdAt: string;
}

export interface IFollowRequestIncoming {
  _id: string;
  requesterId: IUserPreview;
  targetId: string;
  createdAt: string;
}

export interface IFollowRequestOutgoing {
  _id: string;
  requesterId: string;
  targetId: IUserPreview;
  createdAt: string;
}

export type TFollowListMode = 'followers' | 'following';
