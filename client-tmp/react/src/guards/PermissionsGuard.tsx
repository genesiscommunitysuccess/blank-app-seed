import { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@genesislcap/foundation-user';
import { NOT_PERMITTED_PATH } from '../config';

interface PermissionsGuardProps {
  children: ReactNode;
  permissionCode?: string;
}

const PermissionsGuard: React.FC<PermissionsGuardProps> = ({ children, permissionCode }: PermissionsGuardProps) => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      const user = getUser();
      if (permissionCode && !user.hasPermission(permissionCode)) {
        navigate(`/${NOT_PERMITTED_PATH}`);
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkPermission();
  }, [navigate, permissionCode]);

  if (isLoading) {
    return <div>Loading...</div>; // Or some loading component
  }

  return isAuthorized ? <>{children}</> : null;
};

export default PermissionsGuard;