import { css } from '@genesislcap/web-core';
import { errorMessageStyles, mixinScreen } from '../../styles';

export const NotPermittedStyles = css`
  ${errorMessageStyles}

  :host {
    ${mixinScreen('flex')}

    align-items: center;
    justify-content: center;
  }
`;
