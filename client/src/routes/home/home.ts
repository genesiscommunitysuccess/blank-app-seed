import { customElement, FASTElement } from '@microsoft/fast-element';
import { HomeTemplate as template } from './home.template';
import { HomeStyles as styles } from './home.styles';

@customElement({
  name: 'home-route',
  template,
  styles,
})
export class Home extends FASTElement {
  constructor() {
    super();
  }
}
