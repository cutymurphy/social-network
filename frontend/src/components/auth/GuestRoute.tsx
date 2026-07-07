import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/useAuthStore";
import { ERoutes } from "../../router/routes";
import { SupportContent } from "../atoms/SupportContent";

export const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SupportContent isLoading={true} />;
  }

  if (user) {
    return <Navigate to={ERoutes.main} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
