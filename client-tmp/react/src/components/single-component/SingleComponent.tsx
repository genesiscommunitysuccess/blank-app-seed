import { SingleComponentOutlet } from '@genesislcap/foundation-react-utils/router';
import { applyMode, injectThemeStyles, resolveInitialMode } from '@genesislcap/rapid-design-system';
import { useEffect, useRef } from 'react';
import { registerStylesTarget } from '../../pbc/utils';
import { activeTheme } from '../../styles/active-theme';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { initialComponentName } from './initialParams';
import { registry } from './registry';

export { SINGLE_COMPONENT_PARAM, initialComponentName } from './initialParams';

// Defined outside JSX so the template stays free of inline `style={{ … }}`,
// whose double braces collide with the seed's handlebars interpolation.
const providerStyle = { display: 'block', height: '100%', width: '100%' } as const;

/**
 * Renders a single registered component full-screen based on the
 * `?component=<name>` URL parameter captured at app load. The component is
 * wrapped in the same design-system provider / theme that DefaultLayout sets
 * up (the FUI modal-theme runtime via `activeTheme`), so it is themed
 * identically to how it appears in-app — just without the header and
 * navigation chrome (and without a mode toggle).
 *
 * Resolution + fallback are handled by `SingleComponentOutlet` from
 * `@genesislcap/foundation-react-utils/router`; this file only supplies the
 * app-specific provider/theming and the themed unknown-component message.
 */
const SingleComponent = () => {
  const providerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (providerRef.current) {
      injectThemeStyles(providerRef.current, activeTheme);
      applyMode(providerRef.current, activeTheme, resolveInitialMode(activeTheme));
      registerStylesTarget(document.body, 'content');
    }
  }, []);

  return (
    <rapid-design-system-provider ref={providerRef} style={providerStyle}>
      <SingleComponentOutlet
        name={initialComponentName}
        registry={registry}
        renderUnknown={(name, available) => (
          <ErrorMessage
            elementType="h3"
            message={`Unknown component "${name ?? ''}". Available: ${available.join(', ')}`}
          />
        )}
      />
    </rapid-design-system-provider>
  );
};

export default SingleComponent;
