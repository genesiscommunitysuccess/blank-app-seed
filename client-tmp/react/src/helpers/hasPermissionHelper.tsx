import { getUser } from '@genesislcap/foundation-user';

const hasPermissionHelper = (permissionCode: string | undefined): boolean => {
  if (!permissionCode) {
    return true;
  }

  return getUser().hasPermission(permissionCode);
};

export default hasPermissionHelper;