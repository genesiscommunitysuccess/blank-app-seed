import { getUser, navigateTo } from '@genesislcap/foundation-auth';
import { Auth, Connect } from '@genesislcap/foundation-comms';
import { FoundationRouterConfiguration } from '@genesislcap/foundation-ui';
import { GENESIS_SOCKET_URL, PUBLIC_PATH } from '@genesislcap/foundation-utils';
import { defaultLayout, loginLayout } from '../layouts';
import { NotFound } from './not-found/not-found';
import { defaultNotPermittedRoute, NotPermitted } from './not-permitted/not-permitted';
import { LoginSettings } from './types';
{{#each routes}}
import { {{pascalCase this.name}} } from './{{kebabCase this.name}}/{{kebabCase this.name}}';
{{/each}}

// eslint-disable-next-line
declare var ENABLE_SSO: string;

const ssoSettings =
  typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === 'true'
    ? {
        autoAuth: true,
        sso: {
          toggled: true,
          identityProvidersPath: 'gwf/sso/list',
        },
      }
    : {};

const publicPath = typeof PUBLIC_PATH !== 'undefined' ? PUBLIC_PATH : '';

export class MainRouterConfig extends FoundationRouterConfiguration<LoginSettings> {
  @Connect private connect: Connect;
  @Auth private auth: Auth;

  async configure() {
    this.configureAnalytics();
    this.configureRoutePermittedChecks();
    this.configureFallbackRouteDefinition();
    this.title = '{{capitalCase appName}}';
    this.defaultLayout = defaultLayout;

    const authPath = 'login';

    this.routes.map(
      { path: '', redirect: authPath },
      {
        path: authPath,
        name: 'login',
        title: 'Login',
        element: async () => {
          const { configure, defaultAuthConfig } = await import(
            '@genesislcap/foundation-auth/config'
          );
          return configure({
            omitRoutes: ['request-account', 'forgot-password'],
            fields: {
              ...defaultAuthConfig.fields,
              username: {
                ...defaultAuthConfig.fields.username,
                pattern: '^[a-zA-Z0-9.@_:-]*$',
              },
            },
            hostPath: this.loginPath,
            postLoginRedirect: async () => {
              await this.connect.connect(GENESIS_SOCKET_URL);
              const lastPath =
                getUser().lastPath() === `${publicPath}/` ? undefined : getUser().lastPath();
              const defaultPath = publicPath + '/{{kebabCase routes.[0].name}}';
              navigateTo(lastPath ?? defaultPath);
            },
            postLogoutRedirect: () => {
              if (this.connect.isConnected) {
                this.connect.disconnect();
              }
              defaultAuthConfig.postLogoutRedirect();
            },
            ...ssoSettings,
          });
        },
        layout: loginLayout,
        settings: { public: true },
        childRouters: true,
      },
      { path: 'not-found', element: NotFound, title: 'Not Found', name: 'not-found' },
      {
        path: defaultNotPermittedRoute,
        element: NotPermitted,
        title: 'Not Permitted',
        name: defaultNotPermittedRoute,
      },
      {{#each routes}}
      {
        path: '{{kebabCase this.name}}',
        element: {{pascalCase this.name}},
        title: '{{sentenceCase this.name}}',
        name: '{{kebabCase this.name}}',
        {{#if this.permissions.viewRight}}
        settings: { isPermitted: () => this.auth.currentUser.hasPermission('{{this.permissions.viewRight}}') },
        {{/if}}
        navItems: [
          {
            title: '{{sentenceCase this.name}}',
            icon: {
              name: 'cog',
              variant: 'solid',
            },
            permission: '{{this.permissions.viewRight}}',
          },
        ],
      },
      {{/each}}
    );

    this.contributors.push({
      navigate: async (phase) => {
        const settings = phase.route.settings;

        /**
         * If the route is public or the user is authenticated don't block
         */
        if (settings?.public || this.user.isAuthenticated) {
          return;
        }

        /**
         * Otherwise route them to login
         */
        this.navigationPhaseLoginRedirect(phase);
      },
    });
  }
}
