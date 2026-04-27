import { isDev } from '@genesislcap/foundation-utils';
import pkg from '../../package.json';

// Returns null to disable persistence in dev unless PERSIST_LAYOUT_IN_DEV=true
export const getFlexLayoutStorageKey = (id: string): string | null => {
  if (isDev() && (pkg as any)?.config.PERSIST_LAYOUT_IN_DEV !== true) {
    return null;
  }
  return `flexlayout_${id}`;
};
