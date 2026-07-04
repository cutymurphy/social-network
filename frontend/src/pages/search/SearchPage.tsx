import { useEffect, useRef, useState } from "react";
import * as usersApi from "../../api/users";
import type { IUserPreview } from "../../types/user";
import styles from "./SearchPage.module.scss";
import { SearchField } from "../../components/atoms/SearchField";
import { delay } from "../../utils/delay";
import { UserList } from "../../components/organisms/UserList";

const LIMIT = 10;

export const SearchPage = () => {
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const loadingRef = useRef(false);

  const runSearch = async (currentSkip: number) => {
    if (!query.trim()) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    await delay(1000);

    try {
      const data = await usersApi.searchUsers(query.trim(), currentSkip, LIMIT);
      setUsers((prevUsers) =>
        currentSkip === 0 ? data.users : [...prevUsers, ...data.users],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.users.length);
      setSearched(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const startSearch = () => {
    if (!query.trim()) return;

    setUsers([]);
    setSkip(0);
    setHasMore(false);
    runSearch(0);
  };

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setSkip(0);
      setHasMore(false);
      setSearched(false);
    }
  }, [query]);

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        <h2>Поиск пользователей</h2>
        <SearchField query={query} setQuery={setQuery} onSearch={startSearch} />
        <div className={styles.usersWrapper}>
          <UserList
            users={users}
            hasMore={hasMore}
            loading={loading}
            searched={searched}
            onLoadMore={() => runSearch(skip)}
          />
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
