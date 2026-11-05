import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { applyMode, injectThemeStyles, resolveInitialMode } from '@genesislcap/rapid-design-system';
import { activeTheme } from '../../../styles/active-theme';

@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank.layout.html',
  styleUrls: ['./blank.layout.css'],
})
export class BlankLayoutComponent implements AfterViewInit {
  @ViewChild('designSystemProvider') designSystemProviderElement!: ElementRef;

  ngAfterViewInit() {
    injectThemeStyles(this.designSystemProviderElement.nativeElement, activeTheme);
    applyMode(
      this.designSystemProviderElement.nativeElement,
      activeTheme,
      resolveInitialMode(activeTheme),
    );
  }
}
