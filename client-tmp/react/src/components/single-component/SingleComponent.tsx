import { SingleComponentOutlet } from '@genesislcap/foundation-react-utils/router';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import { useEffect, useRef } from 'react';
import { registerStylesTarget } from '../../pbc/utils';
import * as designTokens from '../../styles/design-tokens.json';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { initialComponentName } from './initialParams';
import { registry } from './registry';

export { SINGLE_COMPONENT_PARAM, initialComponentName } from './initialParams';

/**
 * Renders a single registered component full-screen based on the
 * `?component=<name>` URL parameter captured at app load. The component is
 * wrapped in the same design-system provider / style targets that
 * DefaultLayout sets up, so it is themed identically to how it appears
 * in-app — just without the header and navigation chrome.
 *
 * Resolution + fallback are handled by `SingleComponentOutlet` from
 * `@genesislcap/foundation-react-utils/router`; this file only supplies the
 * app-specific provider/theming and the themed unknown-component message.
 */
const SingleComponent = () => {
  const providerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (providerRef.current) {
      configureDesignSystem(providerRef.current, designTokens);
      registerStylesTarget(document.body, 'content');
    }
  }, []);

  return (
    <rapid-design-system-provider
      ref={providerRef}
      style={{ display: 'block', height: '100%', width: '100%' }}
    >
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
