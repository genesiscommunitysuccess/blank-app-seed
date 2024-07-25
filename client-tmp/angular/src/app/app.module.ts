import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './layouts/default/default.layout';
import { BlankLayoutComponent } from './layouts/blank/blank.layout';
import { LayoutLazyLoadDirective } from './directive/app-lazy-load.directive';

@NgModule({
  declarations: [
    AppComponent,
    LayoutLazyLoadDirective,
    DefaultLayoutComponent,
    BlankLayoutComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
