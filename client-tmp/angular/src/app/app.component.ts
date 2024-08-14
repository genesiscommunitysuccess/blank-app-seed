import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import getLayoutNameByRoute from './utils/getLayoutNameByRoute';
import type { LayoutComponentName } from './types/layout';
import { configureFoundationLogin } from './share/foundation-login';
import { registerComponents } from './share/genesis-components';
import { getStore } from './store';
import { customEventFactory, registerStylesTarget } from '../pbc/utils';
{{#if FDC3.channels.length}}
import { listenToChannel, onFDC3Ready } from './utils';
{{/if}}

@Component({
  selector: '{{rootElement}}',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  layoutName?: LayoutComponentName;
  title = '{{capitalCase appName}}';
  store = getStore();

  constructor(
    private el: ElementRef,
    router: Router,
  ) {
      configureFoundationLogin({ router });
      
    // Set layout componet based on route
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.layoutName = getLayoutNameByRoute(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.addEventListeners();
    this.readyStore();
    registerStylesTarget(this.el.nativeElement, 'main');
    this.loadRemotes();
  }

  ngOnDestroy() {
    this.removeEventListeners();
    this.disconnectStore();
  }

  async loadRemotes() {
    await registerComponents();
  }

  addEventListeners() {
    this.el.nativeElement.addEventListener('store-connected', this.store.onConnected);
  }

  removeEventListeners() {
    this.el.nativeElement.removeEventListener('store-connected', this.store.onConnected);
  }

  readyStore() {
    this.dispatchCustomEvent('store-connected', this.el.nativeElement);
    this.dispatchCustomEvent('store-ready', true);
  }

  disconnectStore() {
    this.dispatchCustomEvent('store-disconnected');
  }

  dispatchCustomEvent(type: string, detail?: any) {
    this.el.nativeElement.dispatchEvent(customEventFactory(type, detail));
  }

  ngAfterViewInit() {
    {{#if FDC3.channels.length}}
    onFDC3Ready(this.FDC3ReadyHandler);
    {{/if}}
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
}
