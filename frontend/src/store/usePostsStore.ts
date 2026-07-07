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
  syncPosts: (posts: IPost[]) => void;
  toggleLike: (post: IPost) => Promise<void>;
}

export const usePostsStore = create<IPostsStore>((set, get) => ({
  likes: {},

  syncPosts: (posts) =>
    set((state) => {
      const next = { ...state.likes };
      for (const post of posts) {
        next[post._id] = {
          likesCount: post.likesCount,
          isLiked: !!post.isLiked,
        };
      }
      return { likes: next };
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
