import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import * as usersApi from "../../api/users";
import { useAuth } from "../../auth/AuthContext";
import type { IMeUser } from "../../types/user";
import { ERoutes } from "../../router";
import { toastError, toastSuccess } from "../../lib/toast";
import styles from "./SettingsPage.module.scss";

export const SettingsPage = () => {
  const { reloadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [me, setMe] = useState<IMeUser | null>(null);

  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    usersApi
      .getMe()
      .then((data) => {
        setMe(data);
        setNickname(data.nickname);
        setBio(data.bio);
        setIsPrivate(data.isPrivate);
      })
      .catch((err) => {
        toastError(err, "Не удалось загрузить профиль");
      });
  }, []);

  const handleProfileSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await usersApi.updateMe({ nickname, bio, isPrivate });
      await reloadUser();
      toastSuccess("Профиль сохранён");
    } catch (err) {
      toastError(err, "Ошибка сохранения");
    }
  };

  const handleAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await usersApi.uploadAvatar(file);
      await reloadUser();
      toastSuccess("Аватар обновлён");
    } catch (err) {
      toastError(err, "Не удалось загрузить аватар");
    }
  };

  const handlePassword = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await usersApi.changePassword({ oldPassword, newPassword });
      toastSuccess("Пароль изменён");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toastError(err, "Ошибка смены пароля");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Удалить аккаунт? Это действие необратимо.")) return;
    try {
      await usersApi.deleteMe();
      await logout();
      navigate(ERoutes.login);
    } catch (err) {
      toastError(err, "Не удалось удалить аккаунт");
    }
  };

  if (!me) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  return (
    <main className={styles.main}>
      <h2>Настройки</h2>
      <h3>Профиль</h3>
      <div>
        {me.avatarUrl && (
          <img src={me.avatarUrl} alt="avatar" style={{ maxWidth: 100 }} />
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleAvatar} />
        </div>
      </div>
      <form onSubmit={handleProfileSave}>
        <div>
          <input
            placeholder="Никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="О себе"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Приватный профиль
        </label>
        <div>
          <button type="submit">Сохранить</button>
        </div>
      </form>

      <h3>Смена пароля</h3>
      <form onSubmit={handlePassword}>
        <div>
          <input
            type="password"
            placeholder="Старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">Изменить пароль</button>
      </form>

      <h3>Опасная зона</h3>
      <button onClick={handleDelete}>Удалить аккаунт</button>
    </main>
  );
};

export default SettingsPage;
