import { css } from '@microsoft/fast-element';

export const HomeStyles = css`
:host {
  background: var(--fill-color);
  color: var(--neutral-foreground-rest);
}

.wrapper {
  background: var(--fill-color);
  display: flex;
}

.column {
  flex: 1;
  padding: calc(var(--base-horizontal-spacing-multiplier) * 3px);
}

.row {
  display: flex;
}

.padded {
  padding: calc(var(--base-horizontal-spacing-multiplier) * 3px) 0;
}

alpha-button,
alpha-flipper {
  margin-right: calc(var(--base-horizontal-spacing-multiplier) * 2px);
}

alpha-progress-ring {
  margin: 0;
}

alpha-accordion,
alpha-text-field {
  width: 100%;
}
`;
