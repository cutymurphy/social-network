import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import type { IPostItem } from "./types";
import { createModalState, postPath } from "../../../router";
import styles from "./PostItem.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Typography } from "@mui/material";
import { usePostLike } from "../../../store/usePostsStore";

export const PostItem: FC<IPostItem> = ({ post }) => {
  const location = useLocation();

  const likeOverlay = usePostLike(post._id);
  const likesCount = likeOverlay?.likesCount ?? post.likesCount;

  const postLinkProps = {
    to: postPath(post._id),
    state: createModalState(location),
  };

  const media =
    post.mediaType === "image" ? (
      <div className={styles.mediaWrapper}>
        <img
          className={styles.mediaMain}
          src={post.mediaUrl}
          alt={post.caption}
        />
      </div>
    ) : (
      <div className={styles.mediaWrapper}>
        <video
          className={styles.videoMain}
          src={post.mediaUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    );

  return (
    <Link {...postLinkProps} className={styles.itemLink}>
      <div className={styles.item}>
        {media}
        <div className={styles.postStatistics}>
          <div className={styles.statistic}>
            <FavoriteIcon />
            <Typography sx={{ fontWeight: 600 }}>{likesCount}</Typography>
          </div>
          <div className={styles.statistic}>
            <ModeCommentIcon />
            <Typography sx={{ fontWeight: 600 }}>
              {post.commentsCount}
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
