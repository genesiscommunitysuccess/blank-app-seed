import { getApp } from '@genesislcap/foundation-shell/app';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import * as rapidDesignSystem from '@genesislcap/rapid-design-system';
import { rapidGridComponents, rapidGridProBeta } from '@genesislcap/rapid-grid-pro';
import { FoundationRouter } from '@genesislcap/foundation-ui';
import { avoidTreeShaking } from '@genesislcap/foundation-utils';

/**
 * Ensure tree shaking doesn't remove these.
 */
avoidTreeShaking(FoundationRouter);

/**
 * registerComponents.
 * @public
 */
export async function registerComponents() {
  const { configure: configureHeader } = await import('@genesislcap/foundation-header/config');
  /**
  * Register any PBC components with the design system
  */
  getApp().registerComponents({
    designSystem: rapidDesignSystem,
  });

  rapidDesignSystem
    .provideDesignSystem()
    .register(
      rapidDesignSystem.baseComponents,
      rapidGridProBeta(),
      rapidGridComponents,
      g2plotChartsComponents,
    );

  configureHeader({
    templateOptions: {
      provider: 'template',
      icon: 'rapid-icon',
      button: 'rapid-button',
      connectionIndicator: 'rapid-connection-indicator',
      select: 'rapid-select',
      option: 'rapid-option',
      flyout: 'rapid-flyout',
    },
  });

}
