import type { IPost } from "../../../types/post";

export interface IFeedPostItem {
  post: IPost;
  onToggleLike: (post: IPost) => void;
}
