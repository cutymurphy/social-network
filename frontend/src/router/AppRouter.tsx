import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "../components/auth";
import { LoginPage, RegisterPage } from "../pages/auth";
import { FeedPage } from "../pages/feed";
import { CreatePostPage, PostPage } from "../pages/post";
import { SearchPage } from "../pages/search";
import {
  ProfileFollowersPage,
  ProfileFollowingPage,
  ProfilePageRoute,
} from "../pages/profile";
import { SettingsPage } from "../pages/settings";
import { NotificationsPage } from "../pages/notifications";
import { FollowRequestsPage } from "../pages/follow-requests";
import { PostModal } from "../components/organisms/PostModal";
import { ERoutes, EProfileRoutes } from "./routes";
import { getBackgroundLocation } from "./helpers";
import { FollowListModal } from "../components/organisms/FollowListModal";

export const AppRouter = () => {
  const location = useLocation();
  const background = getBackgroundLocation(location.state);

  return (
    <>
      <Routes location={background || location}>
        <Route element={<GuestRoute />}>
          <Route path={ERoutes.login} element={<LoginPage />} />
          <Route path={ERoutes.register} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={ERoutes.main} element={<FeedPage />} />
          <Route path={ERoutes.create} element={<CreatePostPage />} />
          <Route path={ERoutes.search} element={<SearchPage />} />
          <Route
            path={`${ERoutes.profile}/:id`}
            element={<ProfilePageRoute />}
          />
          <Route
            path={`${ERoutes.profile}/:id/${EProfileRoutes.followers}`}
            element={<ProfileFollowersPage />}
          />
          <Route
            path={`${ERoutes.profile}/:id/${EProfileRoutes.following}`}
            element={<ProfileFollowingPage />}
          />
          <Route path={ERoutes.settings} element={<SettingsPage />} />
          <Route path={`${ERoutes.post}/:id`} element={<PostPage />} />
          <Route path={ERoutes.notifications} element={<NotificationsPage />} />
          <Route path={ERoutes.requests} element={<FollowRequestsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ERoutes.main} replace />} />
      </Routes>

      {background && (
        <Routes>
          <Route path={`${ERoutes.post}/:id`} element={<PostModal />} />
          <Route
            path={`${ERoutes.profile}/:id/${EProfileRoutes.followers}`}
            element={<FollowListModal mode="followers" />}
          />
          <Route
            path={`${ERoutes.profile}/:id/${EProfileRoutes.following}`}
            element={<FollowListModal mode="following" />}
          />
        </Routes>
      )}
    </>
  );
};
