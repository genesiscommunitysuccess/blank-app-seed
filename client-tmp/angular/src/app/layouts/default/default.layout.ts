import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FoundationRouteNavItem } from '@genesislcap/foundation-ui';
import {
  applyMode,
  injectThemeStyles,
  nextMode,
  resolveInitialMode,
} from '@genesislcap/rapid-design-system';
import { registerStylesTarget } from '../../../pbc/utils';
import { activeTheme, modeToggleEnabled } from '../../../styles/active-theme';
import { RouteService } from '../../services/route.service';
import BaseLayout from '../base.layout';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default.layout.html',
  styleUrls: ['./default.layout.css'],
})
export class DefaultLayoutComponent extends BaseLayout implements AfterViewInit {
  @ViewChild('designSystemProvider') designSystemProviderElement!: ElementRef;
  navItems: FoundationRouteNavItem[] = [];
  modeToggleEnabled = modeToggleEnabled;
  private themeMode = resolveInitialMode(activeTheme);

  constructor(
    private el: ElementRef,
    router: Router,
    routeService: RouteService,
  ) {
    super(router);
    this.navItems = routeService.getNavItems();
  }

  ngAfterViewInit() {
    injectThemeStyles(this.designSystemProviderElement.nativeElement, activeTheme);
    this.themeMode = resolveInitialMode(activeTheme);
    applyMode(this.designSystemProviderElement.nativeElement, activeTheme, this.themeMode);
    registerStylesTarget(this.el.nativeElement, 'layout');
  }

  navigateAngular = (path: string) => {
    this.router.navigate([path]);
  };

  onLogout = () => {
    this.router.navigate(['/login']);
  };

  onLuminanceToogle = (): void => {
    this.themeMode = nextMode(activeTheme, this.themeMode);
    applyMode(this.designSystemProviderElement.nativeElement, activeTheme, this.themeMode);
  };
}
