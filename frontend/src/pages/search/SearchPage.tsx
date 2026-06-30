import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import * as usersApi from "../../api/users";
import type { IUserPreview } from "../../types/user";
import { profilePath } from "../../router";
import styles from "./SearchPage.module.scss";

const LIMIT = 20;

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = async (currentSkip: number) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await usersApi.searchUsers(query, currentSkip, LIMIT);
      setUsers((prev) =>
        currentSkip === 0 ? data.users : [...prev, ...data.users],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.users.length);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setSkip(0);
    runSearch(0);
  };

  return (
    <main className={styles.main}>
      <h2>Поиск пользователей</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Никнейм"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Найти</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u._id}>
            <Link to={profilePath(u._id)}>{u.nickname}</Link>
          </li>
        ))}
      </ul>

      {loading && <div>Загрузка...</div>}
      {!loading && hasMore && (
        <button onClick={() => runSearch(skip)}>Загрузить ещё</button>
      )}
      {!loading && searched && users.length === 0 && (
        <div>Никого не найдено</div>
      )}
    </main>
  );
};

export default SearchPage;
