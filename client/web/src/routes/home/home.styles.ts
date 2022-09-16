import {css} from '@microsoft/fast-element';
import {mixinScreen} from '../../styles';

export const HomeStyles = css`
  :host {
    ${mixinScreen('flex')}
    align-items: center;
    justify-content: center;
    flex-direction: column;
    --neutral-stroke-divider-rest: var(--neutral-fill-stealth-rest);
  }
`;
