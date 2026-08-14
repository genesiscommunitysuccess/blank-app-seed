import { createProtectedRoute } from '@genesislcap/foundation-react-utils/router';
import { getUser } from '@genesislcap/foundation-user';
import { NOT_PERMITTED_PATH } from '../../config';
import hasPermissionHelper from '../../helpers/hasPermissionHelper';

/**
 * App auth + permission guard. Redirects to `/login` (stashing the full origin
 * location, incl. query + hash) when unauthenticated, or to `/not-permitted`
 * when authenticated but the route's `permissionCode` is denied. The reusable
 * behaviour lives in `@genesislcap/foundation-react-utils/router`; this binds it
 * to this app's user.
 */
const ProtectedRoute = createProtectedRoute({
  getIsAuthenticated: () => getUser().isAuthenticated,
  hasPermission: hasPermissionHelper,
  notPermittedPath: `/${NOT_PERMITTED_PATH}`,
});

export default ProtectedRoute;
