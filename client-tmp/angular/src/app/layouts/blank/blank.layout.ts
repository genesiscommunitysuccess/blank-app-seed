import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { configureDesignSystem } from '@genesislcap/foundation-ui';
import * as designTokens from '../../../styles/design-tokens.json';

@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank.layout.html',
  styleUrls: ['./blank.layout.css'],
})
export class BlankLayoutComponent implements AfterViewInit {
  @ViewChild('designSystemProvider') designSystemProviderElement!: ElementRef;

  ngAfterViewInit() {
    configureDesignSystem(this.designSystemProviderElement.nativeElement, designTokens);
  }
}
