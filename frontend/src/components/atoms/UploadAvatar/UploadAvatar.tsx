import { useEffect, useRef, useState, type ChangeEvent, type FC } from "react";
import type { IUploadAvatar } from "./types";
import { Avatar, Button, ButtonBase, CircularProgress } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import styles from "./UploadAvatar.module.scss";
import * as usersApi from "../../../api/users";
import { toastError, toastSuccess } from "../../../lib/toast";
import { useAuth } from "../../../auth/AuthContext";
import { delay } from "../../../utils/delay";
import { Modal } from "../Modal";

export const UploadAvatar: FC<IUploadAvatar> = ({
  src,
  size,
  onAvatarChange,
}) => {
  const { user, reloadUser } = useAuth();
  const [displaySrc, setDisplaySrc] = useState<string>(src);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    if (!loading) {
      setIsModalOpen(true);
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setIsModalOpen(false);
    await delay(500);
    try {
      const { avatarUrl } = await usersApi.uploadAvatar(file);
      setDisplaySrc(avatarUrl);
      onAvatarChange?.(avatarUrl);
      await reloadUser();
      toastSuccess("Аватар обновлен");
    } catch (err) {
      toastError(err, "Не удалось загрузить аватар");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!user?.avatarUrl) return;
    setLoading(true);
    setIsModalOpen(false);
    await delay(500);
    try {
      await usersApi.deleteAvatar();
      setDisplaySrc("");
      onAvatarChange?.("");
      await reloadUser();
      toastSuccess("Фото профиля удалено");
    } catch (err) {
      toastError(err, "Не удалось удалить аватар");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisplaySrc(src);
  }, [src]);

  return (
    <>
      <ButtonBase
        component="div"
        role={undefined}
        tabIndex={-1}
        aria-label="Avatar image"
        className={styles.avatarWrapper}
        onClick={handleOpenModal}
        sx={{
          borderRadius: "100px",
          "&:has(:focus-visible)": {
            outline: "2px solid",
            outlineOffset: "2px",
          },
        }}
      >
        <Avatar
          alt="Upload new avatar"
          src={displaySrc}
          sx={{
            width: size,
            height: size,
            filter: loading ? "brightness(0.6)" : "none",
            transition: "0.2s",
          }}
        />
        {!displaySrc && !loading && (
          <div className={styles.avatarIcon}>
            <CameraAltIcon sx={{ fontSize: "40px" }} />
          </div>
        )}
        {loading && (
          <div className={styles.avatarLoading}>
            <CircularProgress size={36} sx={{ color: "var(--white)" }} />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
      </ButtonBase>
      <Modal
        open={isModalOpen}
        title="Изменить фото профиля"
        onClose={() => setIsModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <Button variant="contained" onClick={handlePickFile}>
            Загрузить фото
          </Button>
          {user?.avatarUrl && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleAvatarDelete}
            >
              Удалить текущее фото
            </Button>
          )}
          <Button
            variant="text"
            sx={{
              color: "var(--purple)",
            }}
            onClick={() => setIsModalOpen(false)}
          >
            Отмена
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UploadAvatar;
