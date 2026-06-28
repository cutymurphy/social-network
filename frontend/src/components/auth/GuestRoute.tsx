import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ERoutes } from '../../router/routes';

export const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 16 }}>Загрузка...</div>;
  }

  if (user) {
    return <Navigate to={ERoutes.main} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
