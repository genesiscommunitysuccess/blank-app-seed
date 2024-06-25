import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { baseLayerLuminance, StandardLuminance } from '@microsoft/fast-components';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import * as designTokens from '../../../styles/design-tokens.json';
import BaseLayout from '../base.layout';
import { mainMenu } from '../../app.config';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.css'],
})
export class DefaultLayoutComponent extends BaseLayout implements AfterViewInit {
  @ViewChild('designSystemProvider') designSystemProviderElement!: ElementRef;
  allRoutes = mainMenu;

  constructor(
    router: Router,
  ) {
    super(router);
  }

  ngAfterViewInit() {
    configureDesignSystem(this.designSystemProviderElement.nativeElement, designTokens);
  }
  
  navigateAngular = (path: string) => {
    this.router.navigate([path]);
  };
  
  onLuminanceToogle = (): void => {
    baseLayerLuminance.setValueFor(
      this.designSystemProviderElement.nativeElement,
      baseLayerLuminance.getValueFor(this.designSystemProviderElement.nativeElement) ===
        StandardLuminance.DarkMode
        ? StandardLuminance.LightMode
        : StandardLuminance.DarkMode,
    );
  };
}
