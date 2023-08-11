import { Connect, ConnectConfig, defaultConnectConfig } from '@genesislcap/foundation-comms';
import { Navigation } from '@genesislcap/foundation-header';
import { baseLayerLuminance, StandardLuminance } from '@microsoft/fast-components';
import { FASTElement, customElement, observable, DOM } from '@microsoft/fast-element';
import { Container, inject, Registration } from '@microsoft/fast-foundation';
import { DefaultRouteRecognizer } from '@microsoft/fast-router';
import { DynamicTemplate as template, LoadingTemplate, MainTemplate } from './main.template';
import { MainStyles as styles } from './main.styles';
import { MainRouterConfig } from '../routes';
import * as Components from '../components';
import { logger, initSSO } from '../utils';
import designTokens from '../styles/design-tokens.json';
import { configureDesignSystem } from '@genesislcap/foundation-ui';

const name = '{{rootElement}}';

@customElement({
  name,
  template,
  styles,
})
export class MainApplication extends FASTElement {
  @inject(MainRouterConfig) config!: MainRouterConfig;
  @inject(Navigation) navigation!: Navigation;
  @Connect connect!: Connect;
  @Container container!: Container;
  @observable provider!: any;
  @observable ready: boolean = false;
  @observable data: any = null;

  async connectedCallback() {
    super.connectedCallback();
    logger.debug(`${name} is now connected to the DOM`);
    DOM.queueUpdate(() => {
      configureDesignSystem(this.provider, designTokens);
    });

    this.registerDIDependencies();
    await this.loadRemotes();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  onDarkModeToggle() {
    baseLayerLuminance.setValueFor(
      this.provider,
      baseLayerLuminance.getValueFor(this.provider) === StandardLuminance.DarkMode
        ? StandardLuminance.LightMode
        : StandardLuminance.DarkMode
    );
  }

  async loadRemotes() {
    await Components.loadRemotes();
    await initSSO();
    this.ready = true;
  }

  public selectTemplate() {
    return this.ready ? MainTemplate : LoadingTemplate;
  }

  private registerDIDependencies() {
    this.container.register(
      Registration.transient(DefaultRouteRecognizer, DefaultRouteRecognizer),
      /**
       * Register custom configs for core services and micro frontends. Note this can also be done via
       * provideDesignSystem().register(...) if preferred.
       *
       * Registration.instance<CredentialManagerConfig>(CredentialManagerConfig, {
       *  ...defaultCredentialManagerConfig,
       *  cookie: {
       *    ...defaultCredentialManagerConfig.cookie,
       *    path: '/login',
       *  },
       * }),
       */
      Registration.instance<ConnectConfig>(ConnectConfig, {
        ...defaultConnectConfig,
        connect: {
          ...defaultConnectConfig.connect,
          heartbeatInterval: 15_000,
        },
      })
    );
  }
}
