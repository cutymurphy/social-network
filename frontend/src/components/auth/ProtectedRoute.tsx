import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/useAuthStore";
import { ERoutes } from "../../router/routes";
import { SupportContent } from "../atoms/SupportContent";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SupportContent isLoading={true} />;
  }

  if (!user) {
    return <Navigate to={ERoutes.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
