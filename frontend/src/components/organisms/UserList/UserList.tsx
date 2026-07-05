import type { FC } from "react";
import type { IUserList } from "./types";
import styles from "./UserList.module.scss";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import type { IUserPreview } from "../../../types/user";
import { UserItem } from "../../molecules/UserItem";
import clsx from "clsx";

export const UserList: FC<IUserList> = ({
  users,
  hasMore,
  loading,
  searched,
  userClassName,
  usersWrapperClassName,
  onLoadMore,
}) => {
  if (loading && users.length === 0) {
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (!loading && users.length === 0) {
    return (
      <div className={styles.empty}>
        {searched === undefined
          ? "Пусто"
          : !searched
            ? "Начните поиск"
            : "Никого не найдено"}
      </div>
    );
  }

  return (
    <div
      id="users-scroll"
      className={clsx(styles.usersWrapper, usersWrapperClassName)}
    >
      <InfiniteScroll
        dataLength={users.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={
          <div className={styles.loader}>
            <CircularProgress size={28} />
          </div>
        }
        scrollableTarget="users-scroll"
        scrollThreshold={0.9}
      >
        <div className={styles.usersList}>
          {users.map((user: IUserPreview) => (
            <UserItem key={user._id} userClassName={userClassName} {...user} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserList;
