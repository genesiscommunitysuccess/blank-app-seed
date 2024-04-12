import { Connect, ConnectConfig, defaultConnectConfig } from '@genesislcap/foundation-comms';
import { EventEmitter } from '@genesislcap/foundation-events';
import { App } from '@genesislcap/foundation-shell/app';
import { importPBCAssets } from '@genesislcap/foundation-shell/pbc';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import { baseLayerLuminance, StandardLuminance } from '@microsoft/fast-components';
import { FASTElement, customElement, observable, DOM } from '@microsoft/fast-element';
import { Container, inject, Registration } from '@microsoft/fast-foundation';
import { DefaultRouteRecognizer } from '@microsoft/fast-router';
import * as Components from '../components';
import { MainRouterConfig } from '../routes';
import { Store, StoreEventDetailMap } from '../store';
import designTokens from '../styles/design-tokens.json';
{{#if FDC3.channels.length}}
import { listenToChannel, onFDC3Ready } from '../utils';
{{/if}}
import { MainStyles as styles } from './main.styles';
import { DynamicTemplate as template, LoadingTemplate, MainTemplate } from './main.template';

const name = '{{rootElement}}';

/**
 * @fires store-connected - Fired when the store is connected.
 * @fires store-ready - Fired when the store is ready.
 */
@customElement({
  name,
  template,
  styles,
})
export class MainApplication extends EventEmitter<StoreEventDetailMap>(FASTElement) {
  @App app: App;
  @Connect connect!: Connect;
  @Container container!: Container;
  @Store store: Store;

  @inject(MainRouterConfig) config!: MainRouterConfig;

  @observable provider!: any;
  @observable ready: boolean = false;
  @observable data: any = null;

  async connectedCallback() {
    this.registerDIDependencies();
    super.connectedCallback();
    this.addEventListeners();
    this.readyStore();
    await this.loadPBCs();
    await this.loadRemotes();
    {{#if FDC3.channels.length}}
    onFDC3Ready(this.FDC3ReadyHandler);
    {{/if}}
    DOM.queueUpdate(() => {
      configureDesignSystem(this.provider, designTokens);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
    this.disconnectStore();
  }

  onDarkModeToggle() {
    baseLayerLuminance.setValueFor(
      this.provider,
      baseLayerLuminance.getValueFor(this.provider) === StandardLuminance.DarkMode
        ? StandardLuminance.LightMode
        : StandardLuminance.DarkMode,
    );
  }

  async loadPBCs() {
    /**
     * Import PBC assets that may have been added to the ./pbc directory by genx or by hand
     */
    const pbcAssets = await importPBCAssets();
    /**
     * Register bulk assets
     */
    this.app.registerAssets(pbcAssets);
    /**
     * Register the top-level route collection
     */
    this.app.registerRouteCollection(this.config.routes);
  }

  async loadRemotes() {
    const { registerComponents } = Components;
    await registerComponents();
    this.ready = true;
  }

  selectTemplate() {
    return this.ready ? MainTemplate : LoadingTemplate;
  }

  {{#if FDC3.channels.length}}
  FDC3ReadyHandler = () => {
    {{#each FDC3.channels}}
    listenToChannel('{{this.name}}', '{{this.type}}', (result) => {
      console.log('Received FDC3 channel message on: {{this.name}} channel, type: {{this.type}}', result);
      // TODO: Add your listener logic here
      // E.g. open a modal or route to specific page: Route.path.push(`[Route name]`);
    });
    {{/each}}
  };

  {{/if}}
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
      }),
      /**
       * // example of setting grid options for all grids from app level
       * Registration.instance<GridOptionsConfig>(GridOptionsConfig, {
       *  defaultCsvExportParams: csvExportParams,
       * }),
       */
    );
  }

  protected addEventListeners() {
    this.addEventListener('store-connected', this.store.onConnected);
  }

  protected removeEventListeners() {
    this.removeEventListener('store-connected', this.store.onConnected);
  }

  protected readyStore() {
    // @ts-ignore
    this.$emit('store-connected', this);
    this.$emit('store-ready', true);
  }

  protected disconnectStore() {
    this.$emit('store-disconnected');
  }
}
