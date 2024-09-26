import { getUser } from '@genesislcap/foundation-user';

const isAuthenticatedHelper = (): boolean => {
  const user = getUser();

  if (!user.isAuthenticated) {
    user.trackPath();
    return false;
  }

  return true;
};

export default isAuthenticatedHelper;