import { Directive, Input, Renderer2, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[onlyTemplateColDefs]'
})
export class OnlyTemplateColDefsDirective implements OnChanges {
  @Input() onlyTemplateColDefs: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.onlyTemplateColDefs) {
      this.renderer.setAttribute(this.el.nativeElement, 'only-template-col-defs', 'true');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'only-template-col-defs');
    }
  }
}