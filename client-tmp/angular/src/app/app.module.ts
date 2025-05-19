import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PBCContainer } from '../pbc/container';
import { PBCElementsRenderer } from '../pbc/elementsRenderer';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './layouts/default/default.layout';
import { BlankLayoutComponent } from './layouts/blank/blank.layout';
import { LayoutLazyLoadDirective } from './directive/app-lazy-load.directive';
import { RouteService } from './services/route.service';
import { GridsterModule } from 'angular-gridster2';

@NgModule({
  declarations: [
    AppComponent,
    LayoutLazyLoadDirective,
    DefaultLayoutComponent,
    BlankLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(RouteService.routes),
    PBCContainer,
    PBCElementsRenderer,
    GridsterModule,
  ],
  providers: [
    RouteService,
    {
      provide: APP_INITIALIZER,
      useFactory: (service: RouteService, router: Router) => () => router.resetConfig(service.allRoutes()),
      deps: [RouteService, Router],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
