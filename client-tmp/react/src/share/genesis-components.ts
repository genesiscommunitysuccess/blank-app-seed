import { EntityManagement, SmartFormModal } from '@genesislcap/foundation-entity-management';
import { Filters, Form } from '@genesislcap/foundation-forms';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';
import { getApp } from '@genesislcap/foundation-shell/app';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import * as rapidDesignSystem from '@genesislcap/rapid-design-system';
import { rapidGridComponents, rapidGridPro, rapidGridProStyles } from '@genesislcap/rapid-grid-pro';
import { FoundationRouter } from '@genesislcap/foundation-ui';
import { css } from "@genesislcap/web-core";

/**
 * Ensure tree shaking doesn't remove these.
 */
FoundationRouter;
EntityManagement;
Filters;
Form;
SmartFormModal;

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
      rapidGridPro({
        styles: css`
          ${rapidGridProStyles}
          .ag-theme-genesis-rapid,
          .ag-theme-genesis-rapid-dark,
          .ag-theme-genesis-rapid-light {
            --ag-selected-row-background-color: var(--accent-fill-rest);
          }
        `,
      }),
      rapidGridComponents,
      g2plotChartsComponents,
      foundationLayoutComponents,
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
