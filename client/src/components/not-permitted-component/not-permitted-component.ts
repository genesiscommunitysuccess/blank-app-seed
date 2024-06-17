import { customElement, GenesisElement } from '@genesislcap/web-core';
import { notPermittedComponentStyles as styles } from './not-permitted-component.styles';
import { notPermittedComponentTemplate as template } from './not-permitted-component.template';

@customElement({
  name: 'not-permitted-component',
  template,
  styles,
})
export class NotPermittedComponent extends GenesisElement {
  constructor() {
    super();
  }
}
