import { customElement, GenesisElement } from '@genesislcap/web-core';
import { logger } from '../../utils';
import { NotPermittedStyles as styles } from './not-permitted.styles';
import { NotPermittedTemplate as template } from './not-permitted.template';

export const defaultNotPermittedRoute = 'not-permitted';

@customElement({
  name: 'not-permitted-route',
  template,
  styles,
})
export class NotPermitted extends GenesisElement {
  public connectedCallback() {
    super.connectedCallback();
    logger.debug(`${name} is now connected to the DOM`);
  }
}
