import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ModalOverlay } from "../../atoms/ModalOverlay";
import { PostDetailPanel } from "../PostDetail";
import { usePostDetail } from "../../../hooks/usePostDetail";
import { useAuth } from "../../../store/useAuthStore";
import { getBackgroundLocation } from "../../../router";

const modalRoot = document.getElementById("modals-root") as HTMLElement;

export const PostModal = () => {
  const { id = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const background = getBackgroundLocation(location.state);

  const detail = usePostDetail(id);

  const handleClose = useCallback(() => {
    if (!background) return;

    navigate(
      {
        pathname: background.pathname,
        search: background.search,
        hash: background.hash,
      },
      { replace: true, state: background.state ?? null },
    );
  }, [background, navigate]);

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
      <PostDetailPanel
        {...detail}
        onClose={handleClose}
        userId={user?.userId}
      />
    </ModalOverlay>,
    modalRoot,
  );
};

export default PostModal;
