import { errorColor } from '@genesislcap/rapid-design-system';
import { css, neutralLayer4 } from '@genesislcap/web-core';
import { mixinCardTitle } from './typography';

export const stylesCardHeading = css`
  header h1 {
    ${mixinCardTitle}
  }
`;

export const errorMessageStyles = css`
  .error-message {
    color: var(--neutral-foreground-rest);
    background-color: ${neutralLayer4};
    border-color: ${errorColor};
    border-radius: 7px;
    border-style: solid;
    border-width: 4px;
    padding: 5px;
    margin: 15px;
    text-align: center;
    width: fit-content;
  }
`;

export const mixinScreen = (display: string = 'block') => `
  contain: content;
  display: ${display};
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

export const mixinCardStyles = `
  padding: calc(var(--design-unit) * 2px);
`;

/**
 * Temp as these parts are being removed from foundation-ui
 */
export const hideRapidButtonParts = `
  rapid-button::part(info1),
  rapid-button::part(info2) {
    display: none;
  }
`;
