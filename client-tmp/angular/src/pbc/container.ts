import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { deriveElementTag } from './utils';

/**
 * An app level container for the lazy loading of the web component based PBC routes in angular router.
 */
@Component({
    standalone: true,
    selector: 'pbc-container',
    template: `<div #container class="container"></div>`, // todo get rid of the extra div
    styles: [`
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
    `],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
})
export class PBCContainer implements OnInit {
    @ViewChild('container', { static: true }) container!: ElementRef;

    constructor(private route: ActivatedRoute) {}

    async ngOnInit() {
        const { pbcElement, pbcElementTag } = this.route.snapshot.data ?? {};
        if (!pbcElement) {
            return;
        }
        /**
         * Account for PBC elements being a mix of constructors and lazy loading functions
         */
        const element = pbcElement.define ? pbcElement : await pbcElement();
        const tagName = pbcElementTag || deriveElementTag(element.name);
        const customElement = document.createElement(tagName);
        this.container.nativeElement.appendChild(customElement);
    }
}
