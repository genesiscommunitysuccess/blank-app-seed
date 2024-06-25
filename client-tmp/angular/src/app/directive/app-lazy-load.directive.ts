import {
  Directive,
  ViewContainerRef,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { layoutComponentImportsByName } from '../app.config';
@Directive({
  selector: '[appLayoutLazyLoad]',
})
export class LayoutLazyLoadDirective implements OnInit, OnChanges {
  @Input('appLayoutLazyLoad') componentName?: string;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    this.loadComponent();
  }

  ngOnChanges({ componentName }: SimpleChanges) {
    const currentValue = componentName?.currentValue;
    const previousValue = componentName?.previousValue;

    if (currentValue && currentValue !== previousValue) {
      this.loadComponent();
    }
  }

  async loadComponent() {
    this.viewContainerRef.clear();

    if (!this.componentName) {
      return;
    }

    if (!layoutComponentImportsByName[this.componentName]) {
      console.error(`Unknown component name: ${this.componentName}`);
    }

    const component = await layoutComponentImportsByName[this.componentName]();
    this.viewContainerRef.createComponent(component);
  }
}
