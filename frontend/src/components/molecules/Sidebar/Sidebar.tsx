import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import styles from "./Sidebar.module.scss";
import { ERoutes, profilePath } from "../../../router";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MoveToInboxRoundedIcon from "@mui/icons-material/MoveToInboxRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Avatar } from "@mui/material";
import clsx from "clsx";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ERoutes.login);
  };

  if (!user) return null;

  const menuItems = [
    {
      label: "Главная",
      path: ERoutes.main,
      icon: <HomeRoundedIcon />,
    },
    {
      label: "Поиск",
      path: ERoutes.search,
      icon: <SearchRoundedIcon />,
    },
    {
      label: "Уведомления",
      path: ERoutes.notifications,
      icon: <NotificationsNoneRoundedIcon />,
    },
    {
      label: "Новый пост",
      path: ERoutes.create,
      icon: <AddRoundedIcon />,
    },
    {
      label: "Профиль",
      path: profilePath(user.userId),
      icon: (
        <Avatar
          alt="my avatar"
          src={user.avatarUrl}
          sx={{
            width: "32px",
            height: "32px",
            border: "2px solid var(--purple)",
          }}
        />
      ),
    },
    {
      label: "Заявки",
      path: ERoutes.requests,
      icon: <MoveToInboxRoundedIcon />,
    },
  ];

  return (
    <nav className={styles.sidebar}>
      <div className={styles.topMenu}>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className={styles.menuItem}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className={clsx(styles.menuItem, styles.logoutItem)}
      >
        <LogoutRoundedIcon />
        <span>Выйти</span>
      </button>
    </nav>
  );
};

export default Sidebar;
