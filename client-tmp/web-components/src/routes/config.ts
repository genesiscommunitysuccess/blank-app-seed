import { Auth, Session } from '@genesislcap/foundation-comms';
import {
  defaultLoginConfig,
  LoginConfig,
  Settings as LoginSettings,
} from '@genesislcap/foundation-login';
import { FoundationRouterConfiguration } from '@genesislcap/foundation-ui';
import { optional } from '@microsoft/fast-foundation';
import { Route } from '@microsoft/fast-router';
import { defaultLayout, loginLayout } from '../layouts';
import { NotFound } from './not-found/not-found';
import { loginElement } from './login/login';
{{#each routes}}
import { {{pascalCase this.name}} } from './{{kebabCase this.name}}/{{kebabCase this.name}}';
{{/each}}

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
        element: loginElement(this.container),
        layout: loginLayout,
        settings: { public: true },
        childRouters: true,
      },
      { path: 'not-found', element: NotFound, title: 'Not Found', name: 'not-found' },
      {{#each routes}}
      {
        path: '{{kebabCase this.name}}',
        element: {{pascalCase this.name}},
        title: '{{sentenceCase this.name}}',
        name: '{{kebabCase this.name}}',
        navItems: [
          {
            title: '{{sentenceCase this.name}}',
            icon: {
              name: 'cog',
              variant: 'solid',
            },
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
          return;
        }

        /**
         * If allowAutoAuth and session is valid try to connect+auto-login
         */
        if (this.loginConfig.autoAuth && (await this.auth.reAuthFromSession())) {
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
}
