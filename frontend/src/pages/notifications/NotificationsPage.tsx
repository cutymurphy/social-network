import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import * as notificationsApi from "../../api/notifications";
import type { INotification } from "../../types/notification";
import { ENotificationType } from "../../types/notification";
import { createPostModalState, profilePath, postPath } from "../../router";
import styles from "./NotificationsPage.module.scss";

const LIMIT = 20;

const TEXT: Record<ENotificationType, string> = {
  [ENotificationType.like]: "поставил(а) лайк",
  [ENotificationType.comment]: "прокомментировал(а)",
  [ENotificationType.follow]: "подписался(ась) на вас",
  [ENotificationType.follow_request]: "отправил(а) заявку на подписку",
  [ENotificationType.follow_request_accepted]: "принял(а) вашу заявку",
};

export const NotificationsPage = () => {
  const location = useLocation();
  const [items, setItems] = useState<INotification[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (currentSkip: number) => {
    setLoading(true);
    try {
      const data = await notificationsApi.getNotifications(currentSkip, LIMIT);
      setItems((prev) =>
        currentSkip === 0
          ? data.notifications
          : [...prev, ...data.notifications],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.notifications.length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  const handleRead = async (n: INotification) => {
    if (n.read) return;
    await notificationsApi.markAsRead(n._id);
    setItems((prev) =>
      prev.map((it) => (it._id === n._id ? { ...it, read: true } : it)),
    );
  };

  return (
    <main className={styles.main}>
      <h2>Уведомления</h2>
      <div className={styles.notifications}>
        {items.map((n) => (
          <div
            key={n._id}
            onClick={() => handleRead(n)}
            style={{ fontWeight: n.read ? "normal" : "bold" }}
            className={styles.notification}
          >
            <Link to={profilePath(n.fromUserId._id)}>
              {n.fromUserId.nickname}
            </Link>{" "}
            {TEXT[n.type]}
            {n.postId && (
              <Link
                to={postPath(n.postId)}
                state={createPostModalState(location)}
              >
                (пост)
              </Link>
            )}
          </div>
        ))}
      </div>
      {/* {unreadCount()} */}
      {loading && <div>Загрузка...</div>}
      {!loading && hasMore && (
        <button onClick={() => load(skip)}>Загрузить ещё</button>
      )}
      {!loading && items.length === 0 && <div>Уведомлений нет</div>}
    </main>
  );
};

export default NotificationsPage;
