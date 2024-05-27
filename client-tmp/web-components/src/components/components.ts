import { EntityManagement } from '@genesislcap/foundation-entity-management';
import { Form } from '@genesislcap/foundation-forms';
import { Navigation } from '@genesislcap/foundation-header';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';
import { getApp } from '@genesislcap/foundation-shell/app';
import { FoundationRouter } from '@genesislcap/foundation-ui';
import {
  assureDesignSystem,
  DesignSystemModule,
  ResourceType,
} from '@genesislcap/foundation-utils';
import { zeroGridComponents } from '@genesislcap/foundation-zero-grid-pro';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import { logger } from '../utils';

/**
 * Ensure tree shaking doesn't remove these.
 */
FoundationRouter;
Navigation;
EntityManagement;
Form;

/**
 * zeroDesignSystemImport.
 * @remarks
 * Attempts to use a module federation version of zero before falling back to the version that was bundled with the app.
 * @internal
 */
async function zeroDesignSystemImport(): Promise<DesignSystemModule> {
  let module: DesignSystemModule;
  let type: ResourceType = ResourceType.remote;
  try {
    module = await import(
      /* webpackChunkName: "foundation-zero" */
      'foundationZero/ZeroDesignSystem'
    );
    return assureDesignSystem(module);
  } catch (e) {
    logger.info(
      `Please note remoteEntry.js load errors are expected if module federated dependencies are offline. Falling back to locally bundled versions.`,
    );
    type = ResourceType.local;
    module = await import(
      /* webpackChunkName: "foundation-zero" */
      '@genesislcap/foundation-zero'
    );
    return assureDesignSystem(module);
  } finally {
    logger.debug(`Using '${type}' version of foundation-zero`);
  }
}

/**
 * registerComponents.
 * @public
 */
export async function registerComponents() {
  const designSystem = await zeroDesignSystemImport();
  const { provideDesignSystem, baseComponents } = designSystem;

  /**
   * Register any PBC components with the design system
   */
  getApp().registerComponents({
    designSystem,
  });

  provideDesignSystem().register(
    baseComponents,
    zeroGridComponents,
    g2plotChartsComponents,
    foundationLayoutComponents,
  );
}
