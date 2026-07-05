import type { ReactNode } from "react";

export interface IUserItem {
  _id: string;
  nickname: string;
  avatarUrl: string;
  bio?: string;
  avatarSize?: string;
  userClassName?: string;
  action?: ReactNode;
}
