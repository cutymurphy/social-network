import styles from "./Modal.module.scss";
import { useEffect, type FC } from "react";
import type { IModal } from "./types";
import { createPortal } from "react-dom";
import { ModalOverlay } from "../ModalOverlay";
import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";

const modalRoot = document.getElementById("modals-root") as HTMLElement;

export const Modal: FC<IModal> = ({ open, children, title, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        data-testid="modal"
      >
        <div className={styles.modalHeader}>
          {title && <Typography variant="h6">{title}</Typography>}
          <button
            type="button"
            onClick={onClose}
            className={styles.modalCloseIcon}
            aria-label="Закрыть"
            data-testid="modal-close"
          >
            <CloseIcon sx={{ color: "var(--white)" }} />
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </ModalOverlay>,
    modalRoot,
  );
};

export default Modal;
