import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TabPanel } from "@mui/lab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import * as frApi from "../../../api/followRequests";
import type { IFollowRequestIncoming } from "../../../types/follow";
import type { IUserPreview } from "../../../types/user";
import { toastError } from "../../../lib/toast";
import { delay } from "../../../utils/delay";
import { UserList } from "../UserList";
import styles from "./FollowRequests.module.scss";

const LIMIT = 20;
const SCROLL_ID = "incoming-requests-scroll";

export const IncomingRequestsTab: FC = () => {
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [requests, setRequests] = useState<IFollowRequestIncoming[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const loadingRef = useRef(false);

  const setUserPending = (userId: string, pending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) {
        next.add(userId);
      } else {
        next.delete(userId);
      }
      return next;
    });
  };

  const load = useCallback(async (currentSkip: number) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    await delay(500);

    try {
      const data = await frApi.getIncoming(currentSkip, LIMIT);
      setRequests((prev) =>
        currentSkip === 0
          ? data.incomingRequests
          : [...prev, ...data.incomingRequests],
      );
      setUsers((prevUsers) =>
        currentSkip === 0
          ? data.incomingRequests.map((req) => req.requesterId)
          : [
              ...prevUsers,
              ...data.incomingRequests.map((req) => req.requesterId),
            ],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.incomingRequests.length);
    } catch (err) {
      toastError(err, "Не удалось загрузить входящие заявки");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleAccept = async (req: IFollowRequestIncoming) => {
    const userId = req.requesterId._id;
    setUserPending(userId, true);

    try {
      await frApi.acceptRequest(req._id);
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      setRequests((prev) => prev.filter((item) => item._id !== req._id));
    } catch (err) {
      toastError(err, "Не удалось принять заявку");
    } finally {
      setUserPending(userId, false);
    }
  };

  const handleReject = async (req: IFollowRequestIncoming) => {
    const userId = req.requesterId._id;
    setUserPending(userId, true);

    try {
      await frApi.rejectRequest(userId);
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      setRequests((prev) => prev.filter((item) => item._id !== req._id));
    } catch (err) {
      toastError(err, "Не удалось отклонить заявку");
    } finally {
      setUserPending(userId, false);
    }
  };

  const renderUserAction = (user: IUserPreview) => {
    const req = requests.find((item) => item.requesterId._id === user._id);
    if (!req) return null;

    const isPending = pendingIds.has(user._id);

    return (
      <div className={styles.actions}>
        <Tooltip title="Принять" arrow>
          <span>
            <IconButton
              type="button"
              size="small"
              color="primary"
              disabled={isPending}
              aria-label="Принять"
              onClick={() => handleAccept(req)}
            >
              <CheckIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Отклонить" arrow>
          <span>
            <IconButton
              type="button"
              size="small"
              color="error"
              disabled={isPending}
              aria-label="Отклонить"
              onClick={() => handleReject(req)}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    );
  };

  useEffect(() => {
    setUsers([]);
    setRequests([]);
    setSkip(0);
    setHasMore(false);
    load(0);
  }, [load]);

  return (
    <TabPanel value="incoming" className={styles.tabPanel}>
      <UserList
        users={users}
        hasMore={hasMore}
        loading={loading}
        emptyMessage="Входящих заявок нет"
        scrollContainerId={SCROLL_ID}
        onLoadMore={() => load(skip)}
        usersWrapperClassName={styles.usersWrapper}
        renderUserAction={renderUserAction}
      />
    </TabPanel>
  );
};
