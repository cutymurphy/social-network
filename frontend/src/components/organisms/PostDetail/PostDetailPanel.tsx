import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Avatar, CircularProgress, IconButton, TextField } from "@mui/material";
import { SupportContent } from "../../atoms/SupportContent";
import { profilePath } from "../../../router";
import styles from "./PostDetailPanel.module.scss";
import type { FC, SyntheticEvent, UIEvent } from "react";
import { useCallback, useEffect } from "react";
import { formatPostDate } from "../../../utils/formatPostDate";
import { Comment } from "../../molecules/Comment";
import { usePostLike } from "../../../store/usePostsStore";
import type { IPostDetailPanel } from "./types";

const COMMENTS_SCROLL_ID = "post-comments-scroll";

export const PostDetailPanel: FC<IPostDetailPanel> = ({
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
  onClose,
  userId,
}) => {
  const handleCommentsScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (!hasMoreComments || commentsLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight > 80) return;

      loadComments(commentsSkip);
    },
    [hasMoreComments, commentsLoading, commentsSkip, loadComments],
  );

  useEffect(() => {
    if (postLoading || !hasMoreComments || commentsLoading) return;

    const el = document.getElementById(COMMENTS_SCROLL_ID);
    if (!el || el.scrollHeight > el.clientHeight) return;

    loadComments(commentsSkip);
  }, [
    postLoading,
    hasMoreComments,
    commentsLoading,
    comments.length,
    commentsSkip,
    loadComments,
  ]);

  const likeOverlay = usePostLike(post?._id ?? "");
  const isLiked = likeOverlay?.isLiked ?? post?.isLiked;
  const likesCount = likeOverlay?.likesCount ?? post?.likesCount ?? 0;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await addComment();
  };

  if (postLoading) {
    return <SupportContent isLoading={true} />;
  }

  if (!post) {
    return <SupportContent type="error" message="Пост не найден" />;
  }

  const postDate = formatPostDate(post.createdAt);

  return (
    <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
      {onClose && (
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <CloseIcon sx={{ color: "var(--white)" }} />
        </button>
      )}
      <div className={styles.media}>
        {post.mediaType === "image" ? (
          <img
            className={styles.mediaImage}
            src={post.mediaUrl}
            alt={post.caption}
          />
        ) : (
          <video
            className={styles.mediaVideo}
            src={post.mediaUrl}
            controls
            autoPlay
            playsInline
          />
        )}
      </div>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <Link
            to={profilePath(post.authorId._id)}
            className={styles.headerLink}
            onClick={onClose}
          >
            <Avatar
              src={post.authorId.avatarUrl}
              alt={post.authorId.nickname}
            />
            <span>{post.authorId.nickname}</span>
          </Link>
        </div>
        <div className={styles.body}>
          <div
            id={COMMENTS_SCROLL_ID}
            className={styles.comments}
            onScroll={handleCommentsScroll}
          >
            <div className={styles.commentsList}>
              {post.caption && (
                <Comment
                  user={post.authorId}
                  text={post.caption}
                  createdAt={post.createdAt}
                  onNavigate={onClose}
                />
              )}
              {comments.map((comment) => {
                const canDelete =
                  userId === comment.userId._id || userId === post.authorId._id;

                return (
                  <Comment
                    key={comment._id}
                    user={comment.userId}
                    text={comment.text}
                    createdAt={comment.createdAt}
                    canDelete={canDelete}
                    onDelete={() => deleteComment(comment._id)}
                    onNavigate={onClose}
                  />
                );
              })}
              {commentsLoading && comments.length === 0 && (
                <CircularProgress size={28} sx={{ alignSelf: "center" }} />
              )}
              {commentsLoading && comments.length > 0 && (
                <CircularProgress
                  size={28}
                  sx={{ alignSelf: "center", margin: "8px 0" }}
                />
              )}
            </div>
          </div>
          <div className={styles.postMeta}>
            <div className={styles.likesWrapper}>
              <div className={styles.actions}>
                <IconButton
                  onClick={toggleLike}
                  aria-label="Лайк"
                  sx={{ padding: "8px" }}
                >
                  {isLiked ? (
                    <FavoriteIcon className={styles.likeActive} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "var(--white)" }} />
                  )}
                </IconButton>
              </div>
              <div className={styles.likes}>
                {likesCount} отметок «Нравится»
              </div>
            </div>
            <div className={styles.postDate}>
              {postDate} {postDate !== "только что" && "назад"}
            </div>
          </div>
        </div>
        <form className={styles.footer} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            placeholder="Добавьте комментарий..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default PostDetailPanel;
