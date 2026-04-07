import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../../store/useStore';

const PrivateRoute = () => {
  const { isAuthenticated, authLoading } = useStore();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
