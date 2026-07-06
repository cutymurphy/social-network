import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import clsx from "clsx";
import {
  ENotificationType,
  NOTIFICATION_TEXT,
} from "../../../types/notification";
import { createModalState, postPath, profilePath } from "../../../router";
import { formatPostDate } from "../../../utils/formatPostDate";
import styles from "./Notification.module.scss";
import type { INotificationProps } from "./types";

const POST_TYPES = new Set<ENotificationType>([
  ENotificationType.like,
  ENotificationType.comment,
]);

export const Notification: FC<INotificationProps> = ({
  notification,
  isUnread,
}) => {
  const location = useLocation();
  const { fromUserId, type, post, createdAt } = notification;
  const showThumbnail = POST_TYPES.has(type) && !!post;

  return (
    <article className={styles.notification}>
      {isUnread && <div className={styles.unreadBadge} />}
      <Link
        to={profilePath(fromUserId._id)}
        className={styles.avatarLink}
        aria-label={fromUserId.nickname}
      >
        <Avatar
          alt={fromUserId.nickname}
          src={fromUserId.avatarUrl || ""}
          sx={{ width: 44, height: 44 }}
        />
      </Link>
      <div className={styles.content}>
        <p className={clsx(styles.text, isUnread && styles.unread)}>
          <Link to={profilePath(fromUserId._id)} className={styles.nickname}>
            {fromUserId.nickname}
          </Link>{" "}
          {NOTIFICATION_TEXT[type]}
          <span className={styles.time}>{formatPostDate(createdAt)}</span>
        </p>
      </div>
      {showThumbnail && post && (
        <Link
          to={postPath(post._id)}
          state={createModalState(location)}
          className={styles.thumbnail}
          aria-label="Открыть пост"
        >
          {post.mediaType === "video" ? (
            <video
              className={styles.thumbnailVideo}
              src={post.mediaUrl}
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img className={styles.thumbnailImage} src={post.mediaUrl} />
          )}
        </Link>
      )}
    </article>
  );
};

export default Notification;
