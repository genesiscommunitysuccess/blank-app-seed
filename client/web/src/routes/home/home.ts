import {customElement, FASTElement} from '@microsoft/fast-element';
import {HomeTemplate as template} from './home.template';
import {HomeStyles as styles} from './home.styles';

const name = 'home-route';

@customElement({
  name,
  template,
  styles,
})
export class Home extends FASTElement {
    constructor() {
      super();
    }
}
