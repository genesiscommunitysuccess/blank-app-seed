import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { configureDesignSystem, FoundationRouteNavItem } from '@genesislcap/foundation-ui';
import { baseLayerLuminance, StandardLuminance } from '@genesislcap/web-core';
import * as designTokens from '../../../styles/design-tokens.json';
import { RouteService } from '../../services/route.service';
import BaseLayout from '../base.layout';
import { registerStylesTarget } from '../../../pbc/utils';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.css'],
})
export class DefaultLayoutComponent extends BaseLayout implements AfterViewInit {
  @ViewChild('designSystemProvider') designSystemProviderElement!: ElementRef;
  navItems: FoundationRouteNavItem[] = [];

  constructor(
    private el: ElementRef,
    router: Router,
    routeService: RouteService,
  ) {
    super(router);
    this.navItems = routeService.getNavItems();
  }

  ngAfterViewInit() {
    configureDesignSystem(this.designSystemProviderElement.nativeElement, designTokens);
    registerStylesTarget(this.el.nativeElement, 'layout');
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

  // @todo: Workaround - foundation-auth should resolve this issue
  onHeaderClick = (): void => {
    if (window.location.pathname.includes('logout')) {
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("sessionId");
      window.location.reload();
    }
  }
}
