import type { FC } from "react";
import type { IUserItem } from "./types";
import styles from "./UserItem.module.scss";
import { Link } from "react-router-dom";
import { profilePath } from "../../../router";
import { Avatar, Typography } from "@mui/material";
import clsx from "clsx";

export const UserItem: FC<IUserItem> = ({
  _id: id,
  nickname,
  avatarUrl,
  bio,
  avatarSize = "50px",
  userClassName,
  action,
}) => (
  <div className={clsx(styles.user, userClassName)}>
    <Link to={profilePath(id)} className={styles.userLink}>
      <Avatar
        alt={`avatar of ${nickname}`}
        src={avatarUrl || ""}
        sx={{
          width: avatarSize,
          height: avatarSize,
        }}
      />
      <div className={clsx(styles.userInfo, !bio && styles.userInfoSingle)}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {nickname}
        </Typography>
        {bio && (
          <Typography
            variant="caption"
            color="textSecondary"
            className={styles.bio}
          >
            {bio}
          </Typography>
        )}
      </div>
    </Link>
    {action && (
      <div className={styles.action} onClick={(e) => e.stopPropagation()}>
        {action}
      </div>
    )}
  </div>
);

export default UserItem;
