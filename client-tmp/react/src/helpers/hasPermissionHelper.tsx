import { getUser } from '@genesislcap/foundation-user';

const hasPermissionHelper = (permissionCode: string | undefined): boolean => {
  const user = getUser();

  return !!(permissionCode && !user.hasPermission(permissionCode))

};

export default hasPermissionHelper;