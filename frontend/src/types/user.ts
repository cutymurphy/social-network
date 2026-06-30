export interface IUserPreview {
  _id: string;
  nickname: string;
  avatarUrl: string;
  bio?: string;
}

export interface IAuthUser {
  userId: string;
  email: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  isPrivate: boolean;
}

export interface IMeUser {
  _id: string;
  email: string;
  nickname: string;
  bio: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPublicUser {
  _id: string;
  nickname: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isPrivate: boolean;
}

export interface IUpdateUserRequest {
  nickname?: string;
  bio?: string;
  isPrivate?: boolean;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
