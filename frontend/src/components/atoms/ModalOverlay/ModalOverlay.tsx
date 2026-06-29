import type { FC } from "react";
import styles from "./ModalOverlay.module.scss";
import type { IModalOverlay } from "./types";

export const ModalOverlay: FC<IModalOverlay> = ({ children, onClick }) => {
  return (
    <div
      className={styles.overlay}
      onClick={onClick}
      data-testid="modal-overlay"
    >
      {children}
    </div>
  );
};

export default ModalOverlay;
