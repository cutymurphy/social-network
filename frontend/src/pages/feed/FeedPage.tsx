import { useCallback, useEffect, useRef, useState } from "react";

import * as feedApi from "../../api/feed";

import type { IPost } from "../../types/post";

import { PostList } from "../../components/organisms/PostList";

import { toastError } from "../../lib/toast";

const LIMIT = 15;

export const FeedPage = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const [hasMore, setHasMore] = useState(false);

  const [skip, setSkip] = useState(0);

  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  const load = useCallback(async (currentSkip: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

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

  return (
    <div style={{ padding: 16 }}>
      <h2>Лента</h2>

      <PostList
        posts={posts}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={() => load(skip)}
        openOn="comments"
      />
    </div>
  );
};

export default FeedPage;
