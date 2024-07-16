import { configure as configureHeader }from '@genesislcap/foundation-header/config';
import { foundationLayoutComponents } from '@genesislcap/foundation-layout';
import { EntityManagement } from '@genesislcap/foundation-entity-management';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import * as rapidDesignSystem from '@genesislcap/rapid-design-system';
import { rapidGridComponents } from '@genesislcap/rapid-grid-pro';
import { configureFoundationLogin } from './foundation-login';

EntityManagement;

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

configureFoundationLogin();

rapidDesignSystem
 .provideDesignSystem()
 .register(
     rapidDesignSystem.baseComponents,
     rapidGridComponents,
     g2plotChartsComponents,
     foundationLayoutComponents,
 );
