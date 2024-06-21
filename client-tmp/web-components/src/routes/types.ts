import { Settings } from '@genesislcap/foundation-login';

export type LoginSettings = Settings & {
  isPermitted?: () => boolean;
};
