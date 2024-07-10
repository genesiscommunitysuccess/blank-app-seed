import { Component, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import getLayoutNameByRoute from './utils/getLayoutNameByRoute';
import type { LayoutComponentName } from './types/layout';
import { configureFoundationLogin } from './share/foundation-login';
{{#if FDC3.channels.length}}
import { listenToChannel, onFDC3Ready } from '../utils';
{{/if}}

// Genesis Components
import './share/genesis-components';

@Component({
  selector: '{{rootElement}}',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  layoutName?: LayoutComponentName;
  title = '{{capitalCase appName}}';

  constructor(
    private router: Router,
  ) {
      configureFoundationLogin({ router });
      
    // Set layout componet based on route
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.layoutName = getLayoutNameByRoute(event.urlAfterRedirects);
      }
    });
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
}
