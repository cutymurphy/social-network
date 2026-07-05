import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ModalOverlay } from "../../atoms/ModalOverlay";
import { getBackgroundLocation, profilePath } from "../../../router";
import type { IFollowListModal } from "./types";
import type { IUserPreview } from "../../../types/user";
import * as followsApi from "../../../api/follows";
import { useAuth } from "../../../auth/AuthContext";
import { toastError } from "../../../lib/toast";
import styles from "./FollowListModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Typography } from "@mui/material";
import { UserList } from "../UserList";
import { delay } from "../../../utils/delay";

const modalRoot = document.getElementById("modals-root") as HTMLElement;
const LIMIT = 20;

export const FollowListModal: FC<IFollowListModal> = ({ mode }) => {
  const { id = "" } = useParams();
  const { user: authUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const background = getBackgroundLocation(location.state);
  const isOwn = authUser?.userId === id;

  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const loadingRef = useRef(false);

  const load = useCallback(
    async (currentSkip: number) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      await delay(500);
      try {
        if (mode === "followers") {
          const data = await followsApi.getFollowers(id, currentSkip, LIMIT);
          const list = data.followers.map((f) => f.followerId);
          setUsers((prevUsers) =>
            currentSkip === 0 ? list : [...prevUsers, ...list],
          );
          setHasMore(data.hasMore);
          setSkip(currentSkip + data.followers.length);
        } else {
          const data = await followsApi.getFollowing(id, currentSkip, LIMIT);
          const list = data.followings.map((f) => f.followingId);
          setUsers((prevUsers) =>
            currentSkip === 0 ? list : [...prevUsers, ...list],
          );
          setHasMore(data.hasMore);
          setSkip(currentSkip + data.followings.length);
        }
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [id, mode],
  );

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

  const handleUnfollow = async (userId: string) => {
    setUserPending(userId, true);
    try {
      await followsApi.unfollow(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toastError(err, "Не удалось отписаться");
    } finally {
      setUserPending(userId, false);
    }
  };

  const handleRemoveFollower = async (userId: string) => {
    setUserPending(userId, true);
    try {
      await followsApi.removeFollower(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (err) {
      toastError(err, "Не удалось удалить подписчика");
    } finally {
      setUserPending(userId, false);
    }
  };

  const renderUserAction = (user: IUserPreview) => {
    if (!isOwn) return null;

    const isPending = pendingIds.has(user._id);
    const label = mode === "followers" ? "Удалить" : "Отписка";
    const onClick =
      mode === "followers"
        ? () => handleRemoveFollower(user._id)
        : () => handleUnfollow(user._id);

    return (
      <Button
        type="button"
        size="small"
        variant="outlined"
        disabled={isPending}
        onClick={onClick}
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}
      </Button>
    );
  };

  const handleClose = useCallback(() => {
    if (background) {
      navigate(
        {
          pathname: background.pathname,
          search: background.search,
          hash: background.hash,
        },
        { replace: true, state: background.state ?? null },
      );
      return;
    }

    navigate(profilePath(id));
  }, [id, background, navigate]);

  useEffect(() => {
    setUsers([]);
    setSkip(0);
    setHasMore(false);
    load(0);
  }, [load]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  return createPortal(
    <ModalOverlay onClick={handleClose}>
      <div className={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <Typography variant="h6">
            {mode === "followers" ? "Подписчики" : "Подписки"}
          </Typography>
          <button
            type="button"
            onClick={handleClose}
            className={styles.modalCloseIcon}
            aria-label="Закрыть"
            data-testid="modal-close"
          >
            <CloseIcon sx={{ color: "var(--white)" }} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <UserList
            users={users}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={() => load(skip)}
            userClassName={styles.user}
            usersWrapperClassName={styles.usersWrapper}
            renderUserAction={isOwn ? renderUserAction : undefined}
          />
        </div>
      </div>
    </ModalOverlay>,
    modalRoot,
  );
};

export default FollowListModal;
