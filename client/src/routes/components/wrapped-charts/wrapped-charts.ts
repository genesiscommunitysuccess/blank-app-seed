import { customElement } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './wrapped-charts.styles';
import { template } from './wrapped-charts.template';

@customElement({
  name: 'wrapped-charts',
  template,
  styles,
})
export class WrappedCharts extends FoundationElement {
  chartConfig = {
    xField: 'SYMBOL',
    yField: 'TRADING_VOLUME',
  };
}
