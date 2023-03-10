import { allComponents, provideFASTDesignSystem } from '@microsoft/fast-components';
import { EntityManagement } from '@genesislcap/foundation-entity-management';
import { FASTRouter } from '@microsoft/fast-router';
import { zeroGridComponents } from '@genesislcap/foundation-zero-grid-pro';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import { logger } from '../utils';
import { Form } from '@genesislcap/foundation-forms';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';

EntityManagement;
Form;

provideFASTDesignSystem().register(allComponents);

enum ResourceType {
  LOCAL = 'LOCAL',
  REMOTE = 'REMOTE',
}

/**
 * TODO: Think about sharing import functions across micro frontends.
 */
function loadZeroFallback() {
  return import(
    /* webpackMode: "lazy" */
    '@genesislcap/foundation-zero'
  );
}

/**
 * Granular
 */
async function loadZeroDesignSystem() {
  let type = ResourceType.REMOTE;
  try {
    // @ts-ignore
    return await import('foundationZero/ZeroDesignSystem');
  } catch (e) {
    type = ResourceType.LOCAL;
    return await loadZeroFallback();
  } finally {
    logger.debug(`Using '${type}' version of foundationZero/ZeroDesignSystem`);
  }
}

export type LoadRemotesOptions = {};

export async function loadRemotes() {
  const { provideDesignSystem, baseComponents } = await loadZeroDesignSystem();
  return {
    ZeroDesignSystem: provideDesignSystem().register(
      baseComponents,
      zeroGridComponents,
      g2plotChartsComponents,
      foundationLayoutComponents
    ),
  };
}

FASTRouter;
