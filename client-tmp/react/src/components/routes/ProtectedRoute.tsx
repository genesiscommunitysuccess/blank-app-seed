import { getUser } from '@genesislcap/foundation-user';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!getUser().isAuthenticated) {
    const loginState = { from: location };
    return <Navigate to="/login" state={loginState} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
