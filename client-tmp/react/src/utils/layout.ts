import { isDev } from '@genesislcap/foundation-utils';
import pkg from '../../package.json';

// Bump this whenever the persisted flexlayout model changes shape in a way that
// older saves cannot satisfy — the tab `component` ids are generated, so a change
// to how they are derived would otherwise restore a layout whose tabs no longer
// resolve to a component and render as empty panels. A new version simply ignores
// the stale save once and falls back to the generated default layout.
const LAYOUT_SCHEMA_VERSION = 'v2';

// Returns null to disable persistence in dev unless PERSIST_LAYOUT_IN_DEV=true
export const getFlexLayoutStorageKey = (id: string): string | null => {
  if (isDev() && (pkg as any)?.config.PERSIST_LAYOUT_IN_DEV !== true) {
    return null;
  }
  return `flexlayout_${LAYOUT_SCHEMA_VERSION}_${id}`;
};
