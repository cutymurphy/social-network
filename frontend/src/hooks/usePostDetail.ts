import { useCallback, useEffect, useRef, useState } from "react";
import * as postsApi from "../api/posts";
import * as commentsApi from "../api/comments";
import type { IComment } from "../types/comment";
import type { IPost } from "../types/post";
import { toastError } from "../lib/toast";
import { usePostsStore } from "../store/usePostsStore";

const COMMENTS_LIMIT = 20;

export const usePostDetail = (postId: string) => {
  const [post, setPost] = useState<IPost | null>(null);
  const [postLoading, setPostLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(false);
  const [commentsSkip, setCommentsSkip] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>("");
  const commentsLoadingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    setPost(null);
    setPostLoading(true);

    const loadPost = async () => {
      try {
        const data = await postsApi.getPost(postId);
        if (!cancelled) {
          setPost(data);
          usePostsStore.getState().syncPosts([data]);
        }
      } catch (err) {
        if (!cancelled) {
          toastError(err, "Не удалось загрузить пост");
        }
      } finally {
        if (!cancelled) {
          setPostLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  const loadComments = useCallback(
    async (currentSkip: number) => {
      if (commentsLoadingRef.current) return;

      commentsLoadingRef.current = true;
      setCommentsLoading(true);

      try {
        const data = await commentsApi.getComments(
          postId,
          currentSkip,
          COMMENTS_LIMIT,
        );
        setComments((prev) =>
          currentSkip === 0 ? data.comments : [...prev, ...data.comments],
        );
        setHasMoreComments(data.hasMore);
        setCommentsSkip(currentSkip + data.comments.length);
      } catch (err) {
        toastError(err, "Не удалось загрузить комментарии");
      } finally {
        commentsLoadingRef.current = false;
        setCommentsLoading(false);
      }
    },
    [postId],
  );

  useEffect(() => {
    setComments([]);
    setCommentsSkip(0);
    setHasMoreComments(false);
    loadComments(0);
  }, [loadComments]);

  const toggleLike = async () => {
    if (!post) return;
    await usePostsStore.getState().toggleLike(post);
  };

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await commentsApi.createComment({ postId, text: commentText });
      setCommentText("");
      setCommentsSkip(0);
      await loadComments(0);
      setPost((prev) =>
        prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev,
      );
    } catch (err) {
      toastError(err, "Не удалось отправить комментарий");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setPost((prev) =>
        prev
          ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }
          : prev,
      );
    } catch (err) {
      toastError(err, "Не удалось удалить комментарий");
    }
  };

  return {
    post,
    postLoading,
    comments,
    commentsLoading,
    hasMoreComments,
    commentsSkip,
    commentText,
    setCommentText,
    toggleLike,
    addComment,
    deleteComment,
    loadComments,
  };
};
