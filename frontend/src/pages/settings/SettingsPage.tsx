import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as usersApi from "../../api/users";
import { useAuth } from "../../auth/AuthContext";
import {
  initialUpdatePassword,
  initialUpdateUser,
  type TUpdatePassword,
  type IMeUser,
  type TUpdateUser,
  initialUpdateUserErrors,
  type TUpdateUserErrors,
  initialUpdatePasswordErrors,
} from "../../types/user";
import { ERoutes } from "../../router";
import { toastError, toastInfo, toastSuccess } from "../../lib/toast";
import styles from "./SettingsPage.module.scss";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { validateField } from "../../utils/validation";
import { SupportContent } from "../../components/atoms/SupportContent";
import { Modal } from "../../components/atoms/Modal";
import { delay } from "../../utils/delay";
import { PasswordField } from "../../components/atoms/PasswordField";

const MAX_BIO_LENGTH = 150;

export const SettingsPage = () => {
  const { reloadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState<IMeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submittingUser, setSubmittingUser] = useState<boolean>(false);
  const [submittingPassword, setSubmittingPassword] = useState<boolean>(false);
  const [submittingDeletion, setSubmittingDeletion] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [userData, setUserData] = useState<TUpdateUser>({
    ...initialUpdateUser,
  });
  const [userErrors, setUserErrors] = useState<TUpdateUserErrors>({
    ...initialUpdateUserErrors,
  });

  const [passwordData, setPasswordData] = useState<TUpdatePassword>({
    ...initialUpdatePassword,
  });
  const [passwordErrors, setPasswordErrors] = useState<TUpdatePassword>({
    ...initialUpdatePasswordErrors,
  });

  const onChangeUserInfo = <K extends keyof TUpdateUser>(
    field: K,
    value: TUpdateUser[K],
  ) => {
    setUserData({ ...userData, [field]: value });
    if (userErrors[field]) {
      setUserErrors({ ...userErrors, [field]: "" });
    }
  };

  const onChangePasswordInfo = <K extends keyof TUpdatePassword>(
    field: K,
    value: TUpdatePassword[K],
  ) => {
    setPasswordData({ ...passwordData, [field]: value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: "" });
    }
  };

  const validateUserInfo = () => {
    const errors: TUpdateUserErrors = {
      ...userErrors,
      nickname: validateField("nickname", userData.nickname),
      bio: validateField("bio", userData.bio),
    };
    setUserErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const validatePasswordInfo = () => {
    const errors: TUpdatePassword = {
      oldPassword: validateField("password", passwordData.oldPassword),
      newPassword: validateField("password", passwordData.newPassword),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleProfileSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validateUserInfo() || !me) return;

    const payload: Partial<TUpdateUser> = {};

    if (me.nickname !== userData.nickname) {
      payload.nickname = userData.nickname;
    }

    if (me.bio !== userData.bio) {
      payload.bio = userData.bio;
    }

    if (me.isPrivate !== userData.isPrivate) {
      payload.isPrivate = userData.isPrivate;
    }

    if (Object.keys(payload).length === 0) {
      toastInfo("Изменений нет");
      return;
    }

    try {
      setSubmittingUser(true);
      await delay(1000);
      await usersApi.updateMe(payload);
      const updatedMe = await usersApi.getMe();
      setMe(updatedMe);
      await reloadUser();
      toastSuccess("Профиль сохранён");
    } catch (err) {
      toastError(err, "Ошибка сохранения профиля");
    } finally {
      setSubmittingUser(false);
    }
  };

  const handlePasswordSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!validatePasswordInfo()) return;

    if (passwordData.oldPassword === passwordData.newPassword) {
      toastInfo("Пароли не могут повторяться");
      return;
    }

    try {
      setSubmittingPassword(true);
      await delay(1000);
      await usersApi.changePassword(passwordData);
      toastSuccess("Пароль изменён");
      setPasswordData({
        ...initialUpdatePassword,
      });
    } catch (err) {
      toastError(err, "Ошибка смены пароля");
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      setSubmittingDeletion(true);
      await delay(2000);
      await usersApi.deleteMe();
      await logout();
      setIsModalOpen(false);
      navigate(ERoutes.login);
    } catch (err) {
      toastError(err, "Не удалось удалить аккаунт");
    } finally {
      setSubmittingDeletion(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const loadMe = async () => {
      try {
        setIsLoading(true);
        const data = await usersApi.getMe();
        setMe(data);
        setUserData({
          nickname: data.nickname,
          bio: data.bio,
          isPrivate: data.isPrivate,
        });
      } catch (err) {
        toastError(err, "Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    loadMe();
  }, []);

  if (isLoading) {
    return <SupportContent isLoading={true} />;
  }

  if (!isLoading && !me) {
    return (
      <SupportContent
        type="error"
        message="Не удалось загрузить настройки профиля"
      />
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.formWrapper}>
        <Typography variant="h6">Редактировать профиль</Typography>
        <form
          onSubmit={handleProfileSave}
          className={styles.form}
          autoComplete="off"
          noValidate
        >
          <TextField
            fullWidth
            type="text"
            label="Никнейм"
            variant="outlined"
            value={userData.nickname}
            onChange={(e) => onChangeUserInfo("nickname", e.target.value)}
            helperText={userErrors.nickname}
            error={!!userErrors.nickname}
          />
          <TextField
            fullWidth
            label="О себе"
            multiline
            rows={3}
            value={userData.bio}
            onChange={(e) => onChangeUserInfo("bio", e.target.value)}
            helperText={
              userErrors.bio || `${userData.bio.length} / ${MAX_BIO_LENGTH}`
            }
            error={!!userErrors.bio}
            slotProps={{
              htmlInput: {
                maxLength: MAX_BIO_LENGTH,
              },
              formHelperText: {
                sx: {
                  textAlign: "right",
                  margin: 0,
                },
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={userData.isPrivate}
                onChange={(e) =>
                  onChangeUserInfo("isPrivate", e.target.checked)
                }
                slotProps={{
                  input: { "aria-label": "controlled" },
                }}
                sx={{ padding: "0 9px" }}
              />
            }
            sx={{ marginTop: "-20px" }}
            label="Приватный профиль"
          />
          <Button type="submit" variant="contained" disabled={submittingUser}>
            {submittingUser ? (
              <CircularProgress aria-label="Loading…" size="25px" />
            ) : (
              "Сохранить"
            )}
          </Button>
        </form>
      </div>

      <div className={styles.formWrapper}>
        <Typography variant="h6">Смена пароля</Typography>
        <form
          onSubmit={handlePasswordSave}
          className={styles.form}
          autoComplete="off"
          noValidate
        >
          <PasswordField
            label="Старый пароль"
            password={passwordData.oldPassword}
            setPassword={(password: string) =>
              onChangePasswordInfo("oldPassword", password)
            }
            helperText={passwordErrors.oldPassword}
            error={!!passwordErrors.oldPassword}
          />
          <PasswordField
            label="Новый пароль"
            password={passwordData.newPassword}
            setPassword={(password: string) =>
              onChangePasswordInfo("newPassword", password)
            }
            helperText={passwordErrors.newPassword}
            error={!!passwordErrors.newPassword}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={submittingPassword}
          >
            {submittingPassword ? (
              <CircularProgress aria-label="Loading…" size="25px" />
            ) : (
              "Изменить пароль"
            )}
          </Button>
        </form>
      </div>

      <Button
        variant="text"
        color="error"
        onClick={() => setIsModalOpen(true)}
        sx={{ width: "40%", marginTop: "auto" }}
      >
        Удалить аккаунт
      </Button>
      <Modal
        open={isModalOpen}
        title="Вы действительно хотите удалить аккаунт? Это действие необратимо!"
        onClose={() => setIsModalOpen(false)}
      >
        <div className={styles.modalContent}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteProfile}
            disabled={submittingDeletion}
          >
            {submittingDeletion ? (
              <CircularProgress aria-label="Loading…" size="25px" />
            ) : (
              "Удалить аккаунт"
            )}
          </Button>
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
    </main>
  );
};

export default SettingsPage;
