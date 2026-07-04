import type { FC } from "react";
import type { IUserList } from "./types";
import styles from "./UserList.module.scss";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import type { IUserPreview } from "../../../types/user";
import { UserItem } from "../../molecules/UserItem";

export const UserList: FC<IUserList> = ({
  users,
  hasMore,
  loading,
  searched,
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
        {!searched ? "Начните поиск" : "Никого не найдено"}
      </div>
    );
  }

  return (
    <div id="users-scroll" className={styles.usersWrapper}>
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
            <UserItem key={user._id} {...user} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserList;
