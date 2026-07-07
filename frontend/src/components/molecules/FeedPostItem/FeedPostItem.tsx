import { useRef, useState, type FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { createModalState, postPath, profilePath } from "../../../router";
import { formatPostDate } from "../../../utils/formatPostDate";
import styles from "./FeedPostItem.module.scss";
import type { IFeedPostItem } from "./types";

export const FeedPostItem: FC<IFeedPostItem> = ({ post, onToggleLike }) => {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(true);

  const postLinkProps = {
    to: postPath(post._id),
    state: createModalState(location),
  };

  const handleMediaClick = () => {
    if (post.mediaType !== "video") return;

    const video = videoRef.current;
    if (!video) return;

    const next = !muted;
    video.muted = next;
    setMuted(next);
  };

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <Link to={profilePath(post.authorId._id)} className={styles.author}>
          <Avatar
            src={post.authorId.avatarUrl}
            alt={post.authorId.nickname}
            sx={{ width: 36, height: 36 }}
          />
          <div className={styles.authorInfo}>
            <span className={styles.nickname}>{post.authorId.nickname}</span>
            <span className={styles.time}>
              {formatPostDate(post.createdAt)}
            </span>
          </div>
        </Link>
      </header>
      <div
        className={styles.mediaWrapper}
        data-video={post.mediaType === "video" || undefined}
        onClick={handleMediaClick}
      >
        {post.mediaType === "image" ? (
          <img
            className={styles.mediaImage}
            src={post.mediaUrl}
            alt={post.caption}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className={styles.mediaVideo}
              src={post.mediaUrl}
              autoPlay
              muted={muted}
              loop
              playsInline
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            <div className={styles.videoControls}>
              <button
                type="button"
                className={styles.playPauseBtn}
                onClick={handlePlayPause}
                aria-label={playing ? "Пауза" : "Воспроизведение"}
              >
                {playing ? <PauseIcon /> : <PlayArrowIcon />}
              </button>
            </div>
          </>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => onToggleLike(post)}
          aria-label="Лайк"
        >
          {post.isLiked ? (
            <FavoriteIcon className={styles.liked} />
          ) : (
            <FavoriteBorderIcon />
          )}
          {post.likesCount > 0 && <span>{post.likesCount}</span>}
        </button>
        <Link
          {...postLinkProps}
          className={styles.actionBtn}
          aria-label="Комментарии"
        >
          <ModeCommentIcon />
          {post.commentsCount > 0 && <span>{post.commentsCount}</span>}
        </Link>
      </div>
      {post.caption && (
        <div className={styles.caption}>
          <Link
            to={profilePath(post.authorId._id)}
            className={styles.captionAuthor}
          >
            {post.authorId.nickname}
          </Link>
          {post.caption}
        </div>
      )}
    </article>
  );
};

export default FeedPostItem;
