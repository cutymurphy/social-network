import { create } from "zustand";
import * as likesApi from "../api/likes";
import type { IPost } from "../types/post";
import { toastError } from "../lib/toast";

interface IPostLikeState {
  likesCount: number;
  isLiked: boolean;
}

interface IPostsStore {
  likes: Record<string, IPostLikeState>;
  commentsCount: Record<string, number>;
  syncPosts: (posts: IPost[]) => void;
  toggleLike: (post: IPost) => Promise<void>;
  adjustCommentsCount: (postId: string, delta: number) => void;
}

export const usePostsStore = create<IPostsStore>((set, get) => ({
  likes: {},
  commentsCount: {},

  syncPosts: (posts) =>
    set((state) => {
      const nextLikes = { ...state.likes };
      const nextCommentsCount = { ...state.commentsCount };

      for (const post of posts) {
        nextLikes[post._id] = {
          likesCount: post.likesCount,
          isLiked: !!post.isLiked,
        };
        nextCommentsCount[post._id] = post.commentsCount;
      }

      return { likes: nextLikes, commentsCount: nextCommentsCount };
    }),

  adjustCommentsCount: (postId, delta) =>
    set((state) => {
      const current = state.commentsCount[postId] ?? 0;

      return {
        commentsCount: {
          ...state.commentsCount,
          [postId]: Math.max(0, current + delta),
        },
      };
    }),

  toggleLike: async (post) => {
    const current = get().likes[post._id] ?? {
      likesCount: post.likesCount,
      isLiked: !!post.isLiked,
    };

    const optimistic: IPostLikeState = {
      isLiked: !current.isLiked,
      likesCount: current.likesCount + (current.isLiked ? -1 : 1),
    };

    set((state) => ({
      likes: { ...state.likes, [post._id]: optimistic },
    }));

    try {
      if (current.isLiked) {
        await likesApi.unlikePost(post._id);
      } else {
        await likesApi.likePost(post._id);
      }
    } catch (err) {
      set((state) => ({
        likes: { ...state.likes, [post._id]: current },
      }));
      toastError(err, "Не удалось обновить лайк");
    }
  },
}));

export const usePosts = () => usePostsStore();

export const usePostLike = (postId: string) =>
  usePostsStore((state) => state.likes[postId]);

export const usePostCommentsCount = (postId: string) =>
  usePostsStore((state) => state.commentsCount[postId]);
