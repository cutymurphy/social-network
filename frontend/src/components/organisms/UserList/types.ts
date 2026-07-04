import type { IUserPreview } from "../../../types/user";

export interface IUserList {
  users: IUserPreview[];
  hasMore: boolean;
  loading: boolean;
  searched: boolean;
  onLoadMore: () => void;
}
