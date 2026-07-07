import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import * as feedApi from "../../api/feed";
import type { IPost } from "../../types/post";
import { FeedPostItem } from "../../components/molecules/FeedPostItem";
import { toastError } from "../../lib/toast";
import styles from "./FeedPage.module.scss";
import { delay } from "../../utils/delay";
import { usePosts } from "../../store/usePostsStore";

const LIMIT = 10;

export const FeedPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  const { syncPosts, toggleLike } = usePosts();

  const load = useCallback(
    async (currentSkip: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      await delay(500);

      try {
        const data = await feedApi.getFeed(currentSkip, LIMIT);

        setPosts((prev) =>
          currentSkip === 0 ? data.posts : [...prev, ...data.posts],
        );
        syncPosts(data.posts);
        setHasMore(data.hasMore);
        setSkip(currentSkip + data.posts.length);
      } catch (err) {
        toastError(err, "Не удалось загрузить ленту");
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [syncPosts],
  );

  useEffect(() => {
    load(0);
  }, [load]);

  return (
    <main className={styles.main}>
      {loading && posts.length === 0 ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : !loading && posts.length === 0 ? (
        <div className={styles.empty}>
          Лента пуста.
          <br />
          Подпишитесь на пользователей, чтобы видеть их публикации.
        </div>
      ) : (
        <div className={styles.feed}>
          <InfiniteScroll
            dataLength={posts.length}
            next={() => load(skip)}
            hasMore={hasMore}
            loader={
              <div className={styles.loaderMore}>
                <CircularProgress size={32} />
              </div>
            }
            scrollThreshold={0.9}
          >
            {posts.map((post: IPost) => (
              <FeedPostItem
                key={post._id}
                post={post}
                onToggleLike={toggleLike}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </main>
  );
};

export default FeedPage;
