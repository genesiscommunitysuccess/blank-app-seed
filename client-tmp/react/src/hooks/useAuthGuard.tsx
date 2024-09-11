import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@genesislcap/foundation-user';
import { AUTH_PATH } from '@/config';

const useAuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user.isAuthenticated) {
        user.trackPath();
        navigate(`/${AUTH_PATH}`);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [user, navigate]);

  return isAuthenticated;
};

export default useAuthGuard;