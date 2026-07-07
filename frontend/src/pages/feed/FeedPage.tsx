import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import * as feedApi from "../../api/feed";
import * as likesApi from "../../api/likes";
import type { IPost } from "../../types/post";
import { FeedPostItem } from "../../components/molecules/FeedPostItem";
import { toastError } from "../../lib/toast";
import styles from "./FeedPage.module.scss";
import { delay } from "../../utils/delay";

const LIMIT = 10;

export const FeedPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);

  const load = useCallback(async (currentSkip: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    await delay(500);

    try {
      const data = await feedApi.getFeed(currentSkip, LIMIT);

      setPosts((prev) =>
        currentSkip === 0 ? data.posts : [...prev, ...data.posts],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.posts.length);
    } catch (err) {
      toastError(err, "Не удалось загрузить ленту");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  const toggleLike = async (post: IPost) => {
    const snapshot = posts;

    setPosts((prev) =>
      prev.map((p) =>
        p._id === post._id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.likesCount + (p.isLiked ? -1 : 1),
            }
          : p,
      ),
    );

    try {
      if (post.isLiked) {
        await likesApi.unlikePost(post._id);
      } else {
        await likesApi.likePost(post._id);
      }
    } catch (err) {
      setPosts(snapshot);
      toastError(err, "Не удалось обновить лайк");
    }
  };

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
