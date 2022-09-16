import {
  Auth,
  FoundationAnalytics,
  FoundationAnalyticsEvent,
  FoundationAnalyticsEventType,
  Session,
} from '@genesislcap/foundation-comms';
import {Login, Settings as LoginSettings} from '@genesislcap/foundation-login';
import {Constructable} from '@microsoft/fast-element';
import {Container} from '@microsoft/fast-foundation';
import {Route, RouterConfiguration} from '@microsoft/fast-router';
import {defaultLayout, loginLayout} from '../layouts';
import {Home} from './home/home';
import {NotFound} from './not-found/not-found';

export class MainRouterConfig extends RouterConfiguration<LoginSettings> {
  constructor(
    @Auth private auth: Auth,
    @Container private container: Container,
    @FoundationAnalytics private analytics: FoundationAnalytics,
    @Session private session: Session,
  ) {
    super();
  }

  public allRoutes = [
    { index: 1, path: 'home', title: 'Home', icon: 'home', variant: 'solid' },
  ];

  public configure() {
    this.title = 'Blank App Demo';
    this.defaultLayout = defaultLayout;

    const commonSettings: LoginSettings = {allowAutoAuth: true};

    this.routes.map(
      {path: '', redirect: 'login'},
      {path: 'login', element: Login, title: 'Login', name: 'login', settings: {public: true, defaultRedirectUrl: 'home', autoConnect: true}, layout: loginLayout},
      {path: 'home', element: Home, title: 'Home', name: 'home', settings: commonSettings},
      {path: 'not-found', element: NotFound, title: 'Not Found', name: 'not-found'},
    );

    const auth = this.auth;

    /**
     * Example of a FallbackRouteDefinition
     */
    this.routes.fallback(() => (this.auth.isLoggedIn ? {redirect: 'not-found'} : {redirect: 'login'}));

    /**
     * Example of a NavigationContributor
     */
    this.contributors.push({
      navigate: async (phase) => {
        const settings = phase.route.settings;

        this.analytics.trackEvent(FoundationAnalyticsEventType.routeChanged, <FoundationAnalyticsEvent.RouteChanged>{
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
        if (settings && settings.allowAutoAuth && await auth.reAuthFromSession()) {
          return;
        }

        /**
         * Otherwise route them somewhere, like to a login
         */
        phase.cancel(() => {
          this.session.captureReturnUrl();
          Route.name.replace(phase.router, 'login');
        });
      },
    });
  }

  public construct<T>(Type: Constructable<T>): T {
    return this.container.get(Type) as T;
  }
}
