import type { IUserPreview } from "../../../types/user";

export interface IUserList {
  users: IUserPreview[];
  hasMore: boolean;
  loading: boolean;
  searched?: boolean;
  userClassName?: string;
  usersWrapperClassName?: string;
  onLoadMore: () => void;
}
