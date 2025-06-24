import { Settings } from '@genesislcap/foundation-auth';

export type LoginSettings = Settings & {
  isPermitted?: () => boolean;
};
