import { Navigate, useLocation } from 'react-router-dom';
import { getUser } from '@genesislcap/foundation-user';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!getUser().isAuthenticated) {
    const location = useLocation();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;