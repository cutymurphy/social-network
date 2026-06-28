import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ERoutes } from '../../router/routes';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to={ERoutes.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
