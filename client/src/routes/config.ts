import {
  Auth,
  FoundationAnalytics,
  FoundationAnalyticsEvent,
  FoundationAnalyticsEventType,
  Session,
} from '@genesislcap/foundation-comms';
import {
  defaultLoginConfig,
  LoginConfig,
  Settings as LoginSettings,
} from '@genesislcap/foundation-login';
import { Constructable } from '@microsoft/fast-element';
import { Container, optional } from '@microsoft/fast-foundation';
import { Route, RouterConfiguration } from '@microsoft/fast-router';
import { defaultLayout, loginLayout } from '../layouts';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';

// eslint-disable-next-line
declare var ENABLE_SSO: string;

const ssoSettings = typeof ENABLE_SSO !== 'undefined' && ENABLE_SSO === 'true'
  ? {
      autoAuth: true,
      sso: {
        toggled: true,
        identityProvidersPath: 'sso/list',
      },
    }
  : {};

export class MainRouterConfig extends RouterConfiguration<LoginSettings> {
  constructor(
    @Auth private auth: Auth,
    @Container private container: Container,
    @FoundationAnalytics private analytics: FoundationAnalytics,
    @Session private session: Session,
    @optional(LoginConfig)
    private loginConfig: LoginConfig = { ...defaultLoginConfig, autoAuth: true, autoConnect: true }
  ) {
    super();
  }

  public allRoutes = [{ index: 1, path: 'home', title: 'Home', icon: 'home', variant: 'solid' }];

  public configure() {
    this.title = 'Blank App Demo';
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
            autoConnect: true,
            defaultRedirectUrl: 'home',
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
      { path: 'home', element: Home, title: 'Home', name: 'home' },
      { path: 'not-found', element: NotFound, title: 'Not Found', name: 'not-found' }
    );

    const auth = this.auth;

    /**
     * Example of a FallbackRouteDefinition
     */
    this.routes.fallback(() =>
      this.auth.isLoggedIn ? { redirect: 'not-found' } : { redirect: authPath }
    );

    /**
     * Example of a NavigationContributor
     */
    this.contributors.push({
      navigate: async (phase) => {
        const settings = phase.route.settings;

        this.analytics.trackEvent(FoundationAnalyticsEventType.routeChanged, <
          FoundationAnalyticsEvent.RouteChanged
        >{
          path: phase.route.endpoint.path,
        });

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
        if (this.loginConfig.autoAuth && (await auth.reAuthFromSession())) {
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

  public construct<T>(Type: Constructable<T>): T {
    return this.container.get(Type) as T;
  }
}
