import { html } from '@genesislcap/web-core';
import type { NotFound } from './not-found';

export const NotFoundTemplate = html<NotFound>`
  <h1 class="error-message">Not found! 404</h1>
`;
