import type { ReactNode } from "react";
import type { IUserPreview } from "../../../types/user";

export interface IUserList {
  users: IUserPreview[];
  hasMore: boolean;
  loading: boolean;
  searched?: boolean;
  emptyMessage?: string;
  scrollContainerId?: string;
  userClassName?: string;
  usersWrapperClassName?: string;
  renderUserAction?: (user: IUserPreview) => ReactNode;
  onLoadMore: () => void;
}
