import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Connect } from '@genesislcap/foundation-comms';
import getLayoutNameByRoute from './utils/getLayoutNameByRoute';
import type { LayoutComponentName } from './types/layout';
import { configureFoundationAuth } from './share/foundation-auth';
import { registerComponents } from './share/genesis-components';
import { registerStylesTarget } from '../pbc/utils';
{{#if FDC3.channels.length}}
import { listenToChannel, onFDC3Ready } from './utils';
{{/if}}

@Component({
  selector: '{{rootElement}}',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  layoutName?: LayoutComponentName;
  title = '{{capitalCase appName}}';

  // @ts-ignore
  @Connect connect: Connect;

  constructor(
    private el: ElementRef,
    router: Router,
  ) {
    // @ts-ignore
    configureFoundationAuth({ router, connectService: this.connect });
      
    // Set layout componet based on route
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.layoutName = getLayoutNameByRoute(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    registerStylesTarget(this.el.nativeElement, 'main');
    this.loadRemotes();
  }


  async loadRemotes() {
    await registerComponents();
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
