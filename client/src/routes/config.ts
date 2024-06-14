import { Auth, Session } from '@genesislcap/foundation-comms';
import { defaultLoginConfig, LoginConfig } from '@genesislcap/foundation-login';
import { FoundationRouterConfiguration } from '@genesislcap/foundation-ui';
import { NavigationPhase, optional, Route } from '@genesislcap/web-core';
import { defaultLayout, loginLayout } from '../layouts';
import { logger } from '../utils';
{{#each routes}}
import { {{pascalCase this.name}} } from './{{kebabCase this.name}}/{{kebabCase this.name}}';
{{/each}}
import { NotFound } from './not-found/not-found';
import { defaultNotPermittedRoute, NotPermitted } from './not-permitted/not-permitted';
import { LoginSettings } from './types';

// eslint-disable-next-line
declare var ENABLE_SSO: string;

const ssoSettings =
  typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === 'true'
    ? {
        autoAuth: true,
        sso: {
          toggled: true,
          identityProvidersPath: 'sso/list',
        },
      }
    : {};

export class MainRouterConfig extends FoundationRouterConfiguration<LoginSettings> {
  constructor(
    @Auth private auth: Auth,
    @Session private session: Session,
    @optional(LoginConfig)
    private loginConfig: LoginConfig = { ...defaultLoginConfig, autoAuth: true, autoConnect: true },
  ) {
    super();
  }

  async configure() {
    this.configureAnalytics();
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
          const { configure, define } = await import(
            /* webpackChunkName: "foundation-login" */
            '@genesislcap/foundation-login'
          );
          configure(this.container, {
            hostPath: 'login',
            autoConnect: true,
            defaultRedirectUrl: '{{kebabCase routes.[0].name}}',
            ...ssoSettings,
          });
          return define({
            name: `{{rootElement}}-login`,
            /**
             * You can augment the template and styles here when needed.
             */
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

    /**
     * Example of a FallbackRouteDefinition
     */
    this.routes.fallback(() =>
      this.auth.isLoggedIn ? { redirect: 'not-found' } : { redirect: authPath },
    );

    /**
     * Example of a NavigationContributor
     */
    this.contributors.push({
      navigate: async (phase) => {
        const settings = phase.route.settings;

        /**
         * If public route don't block
         */
        if (settings && settings.public) {
          return;
        }

        /**
         * If logged in don't block
         */
        if (this.auth.isLoggedIn) {
          this.redirectIfNotPermitted(settings, phase);
          return;
        }

        /**
         * If allowAutoAuth and session is valid try to connect+auto-login
         */
        if (this.loginConfig.autoAuth && (await this.reAuthFromSession(settings, phase))) {
          return;
        }

        /**
         * Otherwise route them somewhere, like to a login
         */
        phase.cancel(() => {
          this.session.captureReturnUrl();
          Route.name.replace(phase.router, authPath);
        });
      },
    });
  }

  private async reAuthFromSession(settings: LoginSettings, phase: NavigationPhase) {
    return this.auth.reAuthFromSession().then((authenticated) => {
      logger.info(`reAuthFromSession. authenticated: ${authenticated}`);
      if (authenticated) {
        this.redirectIfNotPermitted(settings, phase);
      }
      return authenticated;
    });
  }

  private redirectIfNotPermitted(settings: LoginSettings, phase: NavigationPhase) {
    const { path } = phase.route.endpoint;
    if (settings?.isPermitted && !settings.isPermitted()) {
      logger.warn(`Not permitted - Redirecting URL from ${path} to ${defaultNotPermittedRoute}.`);
      phase.cancel(() => {
        Route.name.replace(phase.router, defaultNotPermittedRoute);
      });
    }
  }
}
