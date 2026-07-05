import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { TabPanel } from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import * as frApi from "../../../api/followRequests";
import type { IFollowRequestOutgoing } from "../../../types/follow";
import type { IUserPreview } from "../../../types/user";
import { toastError } from "../../../lib/toast";
import { delay } from "../../../utils/delay";
import { UserList } from "../UserList";
import type { IOutgoingRequestsTab } from "./types";
import styles from "./FollowRequests.module.scss";

const LIMIT = 20;
const SCROLL_ID = "outgoing-requests-scroll";

export const OutgoingRequestsTab: FC<IOutgoingRequestsTab> = ({ active }) => {
  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [requests, setRequests] = useState<IFollowRequestOutgoing[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const loadingRef = useRef(false);
  const loadedRef = useRef(false);

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
      const data = await frApi.getOutgoing(currentSkip, LIMIT);
      setRequests((prev) =>
        currentSkip === 0
          ? data.outgoingRequests
          : [...prev, ...data.outgoingRequests],
      );
      setUsers((prevUsers) =>
        currentSkip === 0
          ? data.outgoingRequests.map((req) => req.targetId)
          : [...prevUsers, ...data.outgoingRequests.map((req) => req.targetId)],
      );
      setHasMore(data.hasMore);
      setSkip(currentSkip + data.outgoingRequests.length);
    } catch (err) {
      toastError(err, "Не удалось загрузить исходящие заявки");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleCancel = async (req: IFollowRequestOutgoing) => {
    const userId = req.targetId._id;
    setUserPending(userId, true);

    try {
      await frApi.cancelRequest(userId);
      setUsers((prevUser) => prevUser.filter((user) => user._id !== userId));
      setRequests((prev) => prev.filter((item) => item._id !== req._id));
    } catch (err) {
      toastError(err, "Не удалось отменить заявку");
    } finally {
      setUserPending(userId, false);
    }
  };

  const renderUserAction = (user: IUserPreview) => {
    const req = requests.find((item) => item.targetId._id === user._id);
    if (!req) return null;

    const isPending = pendingIds.has(user._id);

    return (
      <div className={styles.actions}>
        <Tooltip title="Отменить" arrow>
          <span>
            <IconButton
              type="button"
              size="small"
              color="error"
              disabled={isPending}
              aria-label="Отменить"
              onClick={() => handleCancel(req)}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    );
  };

  useEffect(() => {
    if (!active || loadedRef.current) return;

    loadedRef.current = true;
    load(0);
  }, [active, load]);

  return (
    <TabPanel value="outgoing" className={styles.tabPanel}>
      <UserList
        users={users}
        hasMore={hasMore}
        loading={loading}
        emptyMessage="Исходящих заявок нет"
        scrollContainerId={SCROLL_ID}
        onLoadMore={() => load(skip)}
        usersWrapperClassName={styles.usersWrapper}
        renderUserAction={renderUserAction}
      />
    </TabPanel>
  );
};
