import type { FC } from "react";
import type { IComment } from "./types";
import styles from "./Comment.module.scss";
import { Link } from "react-router-dom";
import { profilePath } from "../../../router";
import { Avatar } from "@mui/material";
import { formatPostDate } from "../../../utils/formatPostDate";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const Comment: FC<IComment> = ({
  user,
  text,
  createdAt,
  canDelete = false,
  onDelete,
  onNavigate,
}) => {
  return (
    <div className={styles.comment}>
      <Link to={profilePath(user._id)} onClick={onNavigate}>
        <Avatar
          src={user.avatarUrl}
          alt={user.nickname}
          sx={{ width: 32, height: 32, marginTop: "6px" }}
        />
      </Link>
      <div className={styles.commentContent}>
        <Link
          to={profilePath(user._id)}
          className={styles.commentAuthor}
          onClick={onNavigate}
        >
          {user.nickname}
        </Link>
        <span>{text}</span>
        <span className={styles.time}>{formatPostDate(createdAt)}</span>
      </div>
      {canDelete && (
        <button
          type="button"
          className={styles.commentDelete}
          onClick={onDelete}
        >
          <DeleteOutlineOutlinedIcon fontSize="small" />
        </button>
      )}
    </div>
  );
};
