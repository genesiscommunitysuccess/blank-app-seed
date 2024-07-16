import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '../store/AuthContext';
import { Navigate } from 'react-router-dom';
import { AUTH_PATH } from '../config';
interface AuthGuardProps {
  children: ReactNode;
}
const AuthGuard: React.FC<AuthGuardProps> = ({ children }: AuthGuardProps) => {
  const { user, checkAuthStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };

    verifyAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading component
  }

  if (!user) {
    return <Navigate to={`/${AUTH_PATH}`} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
