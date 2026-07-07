import type { IPost } from "../../../types/post";

export interface IPostList {
  posts: IPost[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}
