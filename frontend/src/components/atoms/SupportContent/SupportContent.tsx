import type { FC } from "react";
import styles from "./SupportContent.module.scss";
import CircularProgress from "@mui/material/CircularProgress";
import type { ISupportContent } from "./types";

export const SupportContent: FC<ISupportContent> = ({
  type = "info",
  message,
  isLoading,
}) => {
  return (
    <div className={styles.wrapper}>
      {isLoading && (
        <CircularProgress size={60} sx={{ color: "var(--purple)" }} />
      )}
      {message && <span className={styles[`${type}`]}>{message}</span>}
    </div>
  );
};

export default SupportContent;
