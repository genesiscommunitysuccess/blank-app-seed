import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@genesislcap/foundation-user';
import { NOT_PERMITTED_PATH } from '@/config';

const usePermissionsGuard = (permissionCode: string | undefined) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = async () => {
      if (permissionCode && !user.hasPermission(permissionCode)) {
        navigate(`/${NOT_PERMITTED_PATH}`);
        setHasPermission(false);
      } else {
        setHasPermission(true);
      }
    };

    checkPermission();
  }, [user, navigate, permissionCode]);

  return hasPermission;
};

export default usePermissionsGuard;