import {customElement, FASTElement} from '@microsoft/fast-element';
import {NotFoundTemplate as template} from './not-found.template';
import {NotFoundStyles as styles} from './not-found.styles';
import {logger} from '../../utils';

const name = 'not-found-route';

@customElement({
  name,
  template,
  styles,
})
export class NotFound extends FASTElement {
  public connectedCallback() {
    super.connectedCallback();
    logger.debug(`${name} is now connected to the DOM`);
  }
}
