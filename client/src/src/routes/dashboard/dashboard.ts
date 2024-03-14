import { customElement, FASTElement } from '@microsoft/fast-element';
import { DashboardStyles as styles } from './dashboard.styles';
import { DashboardTemplate as template } from './dashboard.template';

@customElement({
  name: 'dashboard-route',
  template,
  styles,
})
export class Dashboard extends FASTElement {
  constructor() {
    super();
  }
}
