import type { Dispatch, SetStateAction } from "react";
import type { IComment } from "../../../types/comment";
import type { IPost } from "../../../types/post";

export interface IPostDetailPanel {
  post: IPost | null;
  postLoading: boolean;
  comments: IComment[];
  commentsLoading: boolean;
  hasMoreComments: boolean;
  commentsSkip: number;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  toggleLike: () => Promise<void>;
  addComment: () => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  loadComments: (currentSkip: number) => Promise<void>;
  onClose?: () => void;
  userId?: string;
}
