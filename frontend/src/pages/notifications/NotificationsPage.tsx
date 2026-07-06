import { useCallback, useEffect, useRef, useState } from "react";
import * as notificationsApi from "../../api/notifications";
import type { INotification } from "../../types/notification";
import { toastError } from "../../lib/toast";
import { delay } from "../../utils/delay";
import { Notification } from "../../components/molecules/Notification";
import styles from "./NotificationsPage.module.scss";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 20;
const SCROLL_ID = "notifications-scroll";

export const NotificationsPage = () => {
  const [items, setItems] = useState<INotification[]>([]);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(() => new Set());
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async (currentSkip: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    await delay(500);

    try {
      const data = await notificationsApi.getNotifications(currentSkip, LIMIT);

      setItems((prev) =>
        currentSkip === 0
          ? data.notifications
          : [...prev, ...data.notifications],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.notifications.length);
    } catch (err) {
      toastError(err, "Не удалось загрузить уведомления");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);

      try {
        await delay(500);
        if (cancelled) return;

        const data = await notificationsApi.getNotifications(0, LIMIT);
        if (cancelled) return;

        setUnreadIds(
          new Set(
            data.notifications
              .filter((item) => !item.read)
              .map((item) => String(item._id)),
          ),
        );
        setItems(data.notifications);
        setHasMore(data.hasMore);
        setSkip(data.notifications.length);

        await notificationsApi.markAsSeen();
      } catch (err) {
        if (!cancelled) {
          toastError(err, "Не удалось загрузить уведомления");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.main}>
      <h2>Уведомления</h2>
      {loading && items.length === 0 ? (
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      ) : !loading && items.length === 0 ? (
        <div className={styles.empty}>Уведомлений нет</div>
      ) : (
        <div id={SCROLL_ID} className={styles.scrollWrapper}>
          <InfiniteScroll
            dataLength={items.length}
            next={() => loadMore(skip)}
            hasMore={hasMore}
            loader={
              <div className={styles.loader}>
                <CircularProgress size={28} />
              </div>
            }
            scrollableTarget={SCROLL_ID}
            scrollThreshold={0.9}
          >
            <div className={styles.list}>
              {items.map((notification: INotification) => (
                <Notification
                  key={notification._id}
                  isUnread={unreadIds.has(String(notification._id))}
                  notification={notification}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;
