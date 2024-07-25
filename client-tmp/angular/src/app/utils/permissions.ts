import { User } from '@genesislcap/foundation-user';

export const getViewUpdateRightComponent = (
  user: User,
  right: string,
  event: string | boolean = true,
) => (!right || user.hasPermission(right) ? event : '');