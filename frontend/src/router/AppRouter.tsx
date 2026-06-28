import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "../components/auth";
import { LoginPage, RegisterPage } from "../pages/auth";
import { FeedPage } from "../pages/feed";
import { CreatePostPage, PostPage } from "../pages/post";
import { SearchPage } from "../pages/search";
import { ProfilePage, FollowListPage } from "../pages/profile";
import { SettingsPage } from "../pages/settings";
import { NotificationsPage } from "../pages/notifications";
import { FollowRequestsPage } from "../pages/follow-requests";
import { ERoutes, EProfileRoutes } from "./routes";

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={ERoutes.login} element={<LoginPage />} />
        <Route path={ERoutes.register} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={ERoutes.main} element={<FeedPage />} />
        <Route path={ERoutes.create} element={<CreatePostPage />} />
        <Route path={ERoutes.search} element={<SearchPage />} />
        <Route path={`${ERoutes.profile}/:id`} element={<ProfilePage />} />
        <Route
          path={`${ERoutes.profile}/:id/${EProfileRoutes.followers}`}
          element={<FollowListPage mode="followers" />}
        />
        <Route
          path={`${ERoutes.profile}/:id/${EProfileRoutes.following}`}
          element={<FollowListPage mode="following" />}
        />
        <Route path={ERoutes.settings} element={<SettingsPage />} />
        <Route path={`${ERoutes.post}/:id`} element={<PostPage />} />
        <Route path={ERoutes.notifications} element={<NotificationsPage />} />
        <Route path={ERoutes.requests} element={<FollowRequestsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ERoutes.main} replace />} />
    </Routes>
  );
};

export default AppRouter;
