import { readInitialParam } from '@genesislcap/foundation-react-utils/router';

/**
 * The app shell performs async bootstrap (component registration, session
 * restore) before React Router mounts, and during that window the platform
 * rewrites the URL and drops the query string. We therefore capture the
 * requested component name synchronously at module-evaluation time — which runs
 * during the initial import phase, before any of that async work starts — so
 * the `?component=<name>` request survives.
 */

/** Query-string key used to request a single standalone component. */
export const SINGLE_COMPONENT_PARAM = 'component';

/** The requested component name from the initial URL, or null if absent. */
export const initialComponentName = readInitialParam(SINGLE_COMPONENT_PARAM);
