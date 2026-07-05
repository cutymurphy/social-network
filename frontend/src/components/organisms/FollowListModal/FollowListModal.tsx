import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ModalOverlay } from "../../atoms/ModalOverlay";
import { getBackgroundLocation, profilePath } from "../../../router";
import type { IFollowListModal } from "./types";
import type { IUserPreview } from "../../../types/user";
import * as followsApi from "../../../api/follows";
import styles from "./FollowListModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import { UserList } from "../UserList";
import { delay } from "../../../utils/delay";

const modalRoot = document.getElementById("modals-root") as HTMLElement;
const LIMIT = 20;

export const FollowListModal: FC<IFollowListModal> = ({ mode }) => {
  const { id = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const background = getBackgroundLocation(location.state);

  const [users, setUsers] = useState<IUserPreview[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
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
          />
        </div>
      </div>
    </ModalOverlay>,
    modalRoot,
  );
};

export default FollowListModal;
