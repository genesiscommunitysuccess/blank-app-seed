import { html } from '@microsoft/fast-element';
import { WrappedCharts } from '../components/wrapped-charts/wrapped-charts';
import type { Dashboard } from './dashboard';

WrappedCharts;

export const DashboardTemplate = html<Dashboard>`
  <zero-layout>
    <zero-layout-region>
      <zero-layout-item title="Grid Title">
        <zero-grid-pro>
          <grid-pro-genesis-datasource resource-name="ALL_POSITIONS"></grid-pro-genesis-datasource>
        </zero-grid-pro>
      </zero-layout-item>
      <zero-layout-item title="Charts Title">
        <wrapped-charts></wrapped-charts>
      </zero-layout-item>
    </zero-layout-region>
  </zero-layout>
`;
