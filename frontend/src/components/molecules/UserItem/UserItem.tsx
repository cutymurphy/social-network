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
}) => (
  <Link to={profilePath(id)}>
    <div className={styles.user}>
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
    </div>
  </Link>
);

export default UserItem;
