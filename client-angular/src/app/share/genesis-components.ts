import {
  provideDesignSystem as provideZeroDesignSystem,
  baseComponents as zeroBaseComponents,
} from '@genesislcap/foundation-zero';
import { zeroGridComponents } from '@genesislcap/foundation-zero-grid-pro';
import { g2plotChartsComponents } from '@genesislcap/g2plot-chart';
import { EntityManagement } from '@genesislcap/foundation-entity-management';

EntityManagement;

provideZeroDesignSystem().register(
  zeroBaseComponents,
  zeroGridComponents,
  g2plotChartsComponents,
);
