import { css } from '@genesislcap/web-core';
import { mixinScreen } from '../../styles';

export const NotPermittedStyles = css`
  :host {
    ${mixinScreen('flex')}

    align-items: center;
    justify-content: center;
  }

  h1 {
    text-align: center;
    color: var(--neutral-foreground-rest);
  }
`;
