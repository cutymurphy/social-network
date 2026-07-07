import { PostItem } from "../../molecules/PostItem";
import type { IPostList } from "./types";
import styles from "./PostList.module.scss";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

export const PostList = ({
  posts,
  hasMore,
  loading,
  onLoadMore,
}: IPostList) => {
  if (loading && posts.length === 0) {
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return <div className={styles.empty}>Постов нет</div>;
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={onLoadMore}
      hasMore={hasMore}
      loader={
        <div className={styles.loader}>
          <CircularProgress size={32} />
        </div>
      }
      scrollThreshold={0.9}
    >
      <div className={styles.posts}>
        {posts.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default PostList;
