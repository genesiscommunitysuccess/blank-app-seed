import { getApp } from '@genesislcap/foundation-shell/app';
import type { FoundationRouter } from '@genesislcap/foundation-ui';
import { css, html } from '@microsoft/fast-element';
import { FASTElementLayout } from '@microsoft/fast-router';
import type { Store } from '../store';

type ClientAppRouter = FoundationRouter & { store: Store };

const app = getApp();

const baseLayoutCss = css`
  .container {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
  }

  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

export const loginLayout = new FASTElementLayout(
  html<ClientAppRouter>`
    <div class="container">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  `,
  baseLayoutCss,
);

export const defaultLayout = new FASTElementLayout(
  html<ClientAppRouter>`
    <div class="container">
      ${app.registerElementsTarget('layout-start')}
      <foundation-header
        show-luminance-toggle-button
        show-misc-toggle-button
        :routeNavItems=${(x) => x.config.getNavItems()}
      ></foundation-header>
      <div class="content">
        ${app.registerElementsTarget('content-start')}
        <slot></slot>
        ${app.registerElementsTarget(['content', 'content-end'])}
      </div>
      ${app.registerElementsTarget(['layout', 'layout-end'])}
    </div>
  `,
  css`
    ${baseLayoutCss}

    .content {
      padding-top: 60px;
    }

    foundation-header {
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      align-items: center;
      border: none;
    }

    zero-tree-item zero-icon {
      color: #879ba6;
      padding-right: 10px;
    }

    foundation-header::part(nav-visibility-icon) {
      color: var(--accent-foreground-rest);
    }

    foundation-header::part(notifications-button) {
      position: relative;
    }

    zero-flyout::part(flyout) {
      width: 40%;
      min-width: 320px;
      padding: 0;
    }

    zero-flyout::part(content) {
      height: 100%;
    }
  `.withBehaviors(app.registerStylesTarget('layout')),
);
