import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import getLayoutNameByRoute from './utils/getLayoutNameByRoute';
import type { LayoutComponentName } from './types/layout';
import { configureFoundationLogin } from './share/foundation-login';

// Genesis Components
import './share/genesis-components';

@Component({
  selector: '{{rootElement}}',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
}
