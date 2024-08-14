import { html } from '@genesislcap/web-core';
import type { NotPermittedComponent } from './not-permitted-component';

export const notPermittedComponentTemplate = html<NotPermittedComponent>`
  <h3 class="error-message">You do not have access to view this component.</h3>
`;
