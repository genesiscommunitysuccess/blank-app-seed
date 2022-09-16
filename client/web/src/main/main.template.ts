import {html, ref} from '@microsoft/fast-element';
import type {ViewTemplate} from '@microsoft/fast-element';
import type {MainApplication} from './main';

export const DynamicTemplate: ViewTemplate<MainApplication> = html`
  <zero-design-system-provider ${ref('provider')}>
    <div class="dynamic-template">${(x) => x.selectTemplate()}</div>
  </zero-design-system-provider>
`;

export const LoadingTemplate: ViewTemplate<MainApplication> = html`
  <fast-progress-ring></fast-progress-ring>
`;

export const MainTemplate: ViewTemplate<MainApplication> = html`
  <fast-router
    @dark-mode-toggle=${(x) => x.onDarkModeToggle()}
    :config=${(x) => x.config}
    :navigation=${(x) => x.navigation}
  ></fast-router>
`;
