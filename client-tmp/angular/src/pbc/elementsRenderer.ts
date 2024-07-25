import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppElementPredicate, AppTargetId } from '@genesislcap/foundation-shell/app';
import { createLogger } from '@genesislcap/foundation-logger';
import type { ViewTemplate } from '@genesislcap/web-core';
import { customEventFactory, getTargetElements } from './utils';

/**
 * An app level component for renderering target PBC elements to an angular template.
 */
@Component({
    standalone: true,
    selector: 'pbc-elements-renderer',
    template: `<div #container class="container"></div>`, // < can we get rid of the extra div?
    styles: [`
        .container {}
    `],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    imports: [
        CommonModule,
    ]
})
export class PBCElementsRenderer implements OnChanges, OnInit {
    @ViewChild('container', { static: true }) container!: ElementRef;
    @Input() target: AppTargetId = [];
    @Input() predicate: AppElementPredicate = () => true;
    templates: ViewTemplate[] = [];
    logger = createLogger('pbc-elements-renderer');

    async ngOnInit() {
        this.setTemplates();
        this.renderTemplates();
    }

    $emit(type: string, detail?: any) {
        this.container.nativeElement.dispatchEvent(customEventFactory(type, detail));
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['target']) {
            this.logger.debug('target changed, rendering qualifying elements');
            this.setTemplates();
            this.renderTemplates();
        }
    }

    setTemplates() {
        this.templates = getTargetElements(this.target, this.predicate);
    }

    renderTemplates() {
        this.container.nativeElement.replaceChildren();
        this.templates.forEach((template) => template.render(this, this.container.nativeElement));
    }
}
