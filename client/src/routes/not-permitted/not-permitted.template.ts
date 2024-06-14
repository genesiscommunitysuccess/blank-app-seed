import { html } from '@genesislcap/web-core';
import type { NotPermitted } from './not-permitted';

export const NotPermittedTemplate = html<NotPermitted>`
  <h1>
    You do not have permission to access this part of the application, please contact your
    administrator.
  </h1>
`;
