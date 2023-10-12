import { html, ref } from '@microsoft/fast-element';
import type { ViewTemplate } from '@microsoft/fast-element';
import type { MainApplication } from './main';

export const DynamicTemplate: ViewTemplate<MainApplication> = html`
  <zero-design-system-provider ${ref('provider')}>
    <div class="dynamic-template">${(x) => x.selectTemplate()}</div>
  </zero-design-system-provider>
`;

export const LoadingTemplate: ViewTemplate<MainApplication> = html`
  <zero-progress-ring></zero-progress-ring>
`;

export const MainTemplate: ViewTemplate<MainApplication> = html`
  <fast-router
    @luminance-icon-clicked=${(x) => x.onDarkModeToggle()}
    :config=${(x) => x.config}
    :navigation=${(x) => x.navigation}
  ></fast-router>
`;
