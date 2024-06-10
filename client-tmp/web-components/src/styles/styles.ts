import { css } from '@genesislcap/web-core';
import { mixinCardTitle } from './typography';

export const stylesCardHeading = css`
  header h1 {
    ${mixinCardTitle}
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
