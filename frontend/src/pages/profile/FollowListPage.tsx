import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as followsApi from '../../api/follows';
import type { IUserPreview } from '../../types/user';
import { profilePath } from '../../router';
import type { IFollowListPageProps } from './types';

const LIMIT = 20;

export const FollowListPage = ({ mode }: IFollowListPageProps) => {
  const { id = '' } = useParams();
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (currentSkip: number) => {
      setLoading(true);
      try {
        if (mode === 'followers') {
          const data = await followsApi.getFollowers(id, currentSkip, LIMIT);
          const list = data.followers.map((f) => f.followerId);
          setUsers((prev) => (currentSkip === 0 ? list : [...prev, ...list]));
          setHasMore(data.hasMore);
          setSkip(currentSkip + data.followers.length);
        } else {
          const data = await followsApi.getFollowing(id, currentSkip, LIMIT);
          const list = data.followings.map((f) => f.followingId);
          setUsers((prev) => (currentSkip === 0 ? list : [...prev, ...list]));
          setHasMore(data.hasMore);
          setSkip(currentSkip + data.followings.length);
        }
      } finally {
        setLoading(false);
      }
    },
    [id, mode],
  );

  useEffect(() => {
    setSkip(0);
    load(0);
  }, [load]);

  return (
    <div style={{ padding: 16 }}>
      <h2>{mode === 'followers' ? 'Подписчики' : 'Подписки'}</h2>
      <Link to={profilePath(id)}>← к профилю</Link>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            <Link to={profilePath(u._id)}>{u.nickname}</Link>
          </li>
        ))}
      </ul>
      {loading && <div>Загрузка...</div>}
      {!loading && hasMore && (
        <button onClick={() => load(skip)}>Загрузить ещё</button>
      )}
      {!loading && users.length === 0 && <div>Список пуст</div>}
    </div>
  );
};

export default FollowListPage;
