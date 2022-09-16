import {css} from '@microsoft/fast-element';
import {mixinScreen} from '../../styles';

export const NotFoundStyles = css`
  :host {
    ${mixinScreen('flex')}

    align-items: center;
    justify-content: center;
  }
`;
